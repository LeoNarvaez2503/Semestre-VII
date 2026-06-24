import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from '../entities/asignacion.entity.js';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto.js';
import { VehiculoClientService } from './vehiculo-client.service.js';
import { AuditoriaService } from './auditoria.service.js';
import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';
import { ResponseFlotaDto, VehiculoFlotaDto } from '../dto/response-flota.dto.js';

@Injectable()
export class AsignacionService {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    private readonly vehiculoClient: VehiculoClientService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  /**
   * RF1: Crear una asignación de vehículo a propietario.
   * Valida usuario, vehículo y unicidad de asignación activa.
   */
  async crear(dto: CreateAsignacionDto): Promise<Asignacion> {
    // 1. Validar que el usuario exista y esté activo
    const validacionUsuario = await this.vehiculoClient.validarUsuario(dto.userId);
    if (!validacionUsuario.exists) {
      throw new BadRequestException(`El usuario con ID ${dto.userId} no existe.`);
    }
    if (!validacionUsuario.active) {
      throw new BadRequestException(`El usuario con ID ${dto.userId} está inactivo.`);
    }

    // 2. Validar que el vehículo exista
    const validacionVehiculo = await this.vehiculoClient.validarVehiculo(dto.vehicleId);
    if (!validacionVehiculo.exists) {
      throw new BadRequestException(`El vehículo con ID ${dto.vehicleId} no existe.`);
    }

    // 3. Verificar que el vehículo no esté asignado a otro propietario activo
    const asignacionExistente = await this.asignacionRepository.findOne({
      where: { vehicleId: dto.vehicleId, activo: true },
    });
    if (asignacionExistente) {
      throw new ConflictException(
        `El vehículo con ID ${dto.vehicleId} ya está asignado al usuario ${asignacionExistente.userId}.`,
      );
    }

    // 4. Verificar que no exista ya una asignación activa con la misma clave compuesta
    const duplicada = await this.asignacionRepository.findOne({
      where: { userId: dto.userId, vehicleId: dto.vehicleId, activo: true },
    });
    if (duplicada) {
      throw new ConflictException(
        `Ya existe una asignación activa entre el usuario ${dto.userId} y el vehículo ${dto.vehicleId}.`,
      );
    }

    // 5. Crear la asignación
    const asignacion = this.asignacionRepository.create({
      userId: dto.userId,
      vehicleId: dto.vehicleId,
      activo: true,
      notas: dto.notas ?? null,
    });

    const saved = await this.asignacionRepository.save(asignacion);

    // 6. Registrar auditoría (CREACIÓN)
    await this.auditoriaService.registrar({
      userId: saved.userId,
      vehicleId: saved.vehicleId,
      accion: AccionAuditoria.CREACION,
      payload: {
        nuevo: {
          userId: saved.userId,
          vehicleId: saved.vehicleId,
          activo: saved.activo,
          notas: saved.notas,
          fechaAsignacion: saved.fechaAsignacion,
        },
      },
    });

    return saved;
  }

  /**
   * RF1: Modificar una asignación (transferir vehículo a nuevo propietario o actualizar notas).
   */
  async actualizar(dto: UpdateAsignacionDto): Promise<Asignacion> {
    // 1. Buscar la asignación activa actual
    const asignacionActual = await this.asignacionRepository.findOne({
      where: { userId: dto.userId, vehicleId: dto.vehicleId, activo: true },
    });
    if (!asignacionActual) {
      throw new NotFoundException(
        `No se encontró una asignación activa entre el usuario ${dto.userId} y el vehículo ${dto.vehicleId}.`,
      );
    }

    const datosAnteriores = { ...asignacionActual };

    // 2. Si hay transferencia de propietario
    if (dto.nuevoUserId && dto.nuevoUserId !== dto.userId) {
      // Validar nuevo usuario
      const validacionNuevoUsuario = await this.vehiculoClient.validarUsuario(dto.nuevoUserId);
      if (!validacionNuevoUsuario.exists) {
        throw new BadRequestException(`El nuevo usuario con ID ${dto.nuevoUserId} no existe.`);
      }
      if (!validacionNuevoUsuario.active) {
        throw new BadRequestException(`El nuevo usuario con ID ${dto.nuevoUserId} está inactivo.`);
      }

      // Desactivar asignación actual
      asignacionActual.activo = false;
      await this.asignacionRepository.save(asignacionActual);

      // Registrar auditoría de ELIMINACIÓN de la asignación anterior
      await this.auditoriaService.registrar({
        userId: dto.userId,
        vehicleId: dto.vehicleId,
        accion: AccionAuditoria.ELIMINACION,
        payload: {
          anterior: {
            userId: datosAnteriores.userId,
            vehicleId: datosAnteriores.vehicleId,
            activo: true,
            notas: datosAnteriores.notas,
          },
          nuevo: { activo: false },
          motivo: `Transferido al usuario ${dto.nuevoUserId}`,
        },
      });

      // Crear nueva asignación con el nuevo propietario
      const nuevaAsignacion = this.asignacionRepository.create({
        userId: dto.nuevoUserId,
        vehicleId: dto.vehicleId,
        activo: true,
        notas: dto.notas ?? null,
      });

      const saved = await this.asignacionRepository.save(nuevaAsignacion);

      // Registrar auditoría de CREACIÓN de la nueva asignación
      await this.auditoriaService.registrar({
        userId: saved.userId,
        vehicleId: saved.vehicleId,
        accion: AccionAuditoria.CREACION,
        payload: {
          nuevo: {
            userId: saved.userId,
            vehicleId: saved.vehicleId,
            activo: saved.activo,
            notas: saved.notas,
          },
          motivo: `Transferido desde el usuario ${dto.userId}`,
        },
      });

      return saved;
    }

    // 3. Si solo se actualizan notas
    if (dto.notas !== undefined) {
      asignacionActual.notas = dto.notas;
      const saved = await this.asignacionRepository.save(asignacionActual);

      await this.auditoriaService.registrar({
        userId: saved.userId,
        vehicleId: saved.vehicleId,
        accion: AccionAuditoria.MODIFICACION,
        payload: {
          anterior: { notas: datosAnteriores.notas },
          nuevo: { notas: saved.notas },
        },
      });

      return saved;
    }

    return asignacionActual;
  }

  /**
   * RF1: Eliminar una asignación (desactivación lógica).
   */
  async eliminar(userId: string, vehicleId: string): Promise<{ message: string }> {
    const asignacion = await this.asignacionRepository.findOne({
      where: { userId, vehicleId, activo: true },
    });
    if (!asignacion) {
      throw new NotFoundException(
        `No se encontró una asignación activa entre el usuario ${userId} y el vehículo ${vehicleId}.`,
      );
    }

    const datosAnteriores = { ...asignacion };
    asignacion.activo = false;
    await this.asignacionRepository.save(asignacion);

    // Registrar auditoría (ELIMINACIÓN)
    await this.auditoriaService.registrar({
      userId,
      vehicleId,
      accion: AccionAuditoria.ELIMINACION,
      payload: {
        anterior: {
          userId: datosAnteriores.userId,
          vehicleId: datosAnteriores.vehicleId,
          activo: true,
          notas: datosAnteriores.notas,
          fechaAsignacion: datosAnteriores.fechaAsignacion,
        },
        nuevo: { activo: false },
      },
    });

    return {
      message: `Asignación entre usuario ${userId} y vehículo ${vehicleId} eliminada exitosamente.`,
    };
  }

  /**
   * Listar todas las asignaciones (activas e inactivas).
   */
  async listarTodas(): Promise<Asignacion[]> {
    return this.asignacionRepository.find({
      order: { fechaAsignacion: 'DESC' },
    });
  }

  /**
   * RF3: Consultar la flota de vehículos asignados a un propietario.
   * Cruza datos con el microservicio de vehículos para obtener tipo y categoría.
   */
  async obtenerFlota(userId: string): Promise<ResponseFlotaDto> {
    // 1. Obtener asignaciones activas del usuario
    const asignaciones = await this.asignacionRepository.find({
      where: { userId, activo: true },
    });

    // 2. Para cada vehículo, obtener el detalle del microservicio de vehículos
    const vehiculosPromises = asignaciones.map(async (asignacion) => {
      const detalle = await this.vehiculoClient.obtenerDetalleVehiculo(asignacion.vehicleId);
      if (!detalle) {
        return null;
      }

      const vehiculoFlota: VehiculoFlotaDto = {
        vehicleId: asignacion.vehicleId,
        placa: detalle.plate,
        marca: detalle.brand,
        modelo: detalle.model,
        anio: detalle.year,
        color: detalle.color,
        tipo: detalle.tipo?.toUpperCase() ?? 'DESCONOCIDO',
        clasificacion: detalle.classification,
        fechaAsignacion: asignacion.fechaAsignacion,
      };

      return vehiculoFlota;
    });

    const resultados = await Promise.allSettled(vehiculosPromises);
    const vehiculos = resultados
      .filter(
        (r): r is PromiseFulfilledResult<VehiculoFlotaDto | null> =>
          r.status === 'fulfilled',
      )
      .map((r) => r.value)
      .filter((v): v is VehiculoFlotaDto => v !== null);

    return {
      userId,
      vehiculos,
      totalVehiculos: vehiculos.length,
    };
  }
}
