import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Asignacion } from '../entities/asignacion.entity';
import { Auditoria } from '../entities/auditoria.entity';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto';

@Injectable()
export class AsignacionService {
  private readonly usuariosApiUrl: string;
  private readonly vehiculosApiUrl: string;

  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
    private readonly configService: ConfigService,
  ) {
    this.usuariosApiUrl = this.configService.get<string>(
      'USUARIOS_API_URL',
      'http://localhost:8000',
    );
    this.vehiculosApiUrl = this.configService.get<string>(
      'VEHICULOS_API_URL',
      'http://localhost:3000',
    );
  }

  async validateUser(userId: string): Promise<void> {
    const trimmedUserId = userId.trim();
    try {
      const response = await fetch(`${this.usuariosApiUrl}/usuarios/internal/validar/${trimmedUserId}`);
      if (!response.ok) {
        throw new BadRequestException('Error al validar el propietario. Servicio de usuarios no disponible.');
      }
      const data = await response.json();
      if (!data.exists) {
        throw new BadRequestException(`El usuario con ID ${trimmedUserId} no existe.`);
      }
      if (!data.active) {
        throw new BadRequestException(`El usuario con ID ${trimmedUserId} está inactivo.`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('No se pudo comunicar con el servicio de usuarios para validar el userId.');
    }
  }

  async validateVehicle(vehicleId: string): Promise<void> {
    const trimmedVehicleId = vehicleId.trim();
    try {
      const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/internal/validar/${trimmedVehicleId}`);
      if (!response.ok) {
        throw new BadRequestException('Error al validar el vehículo. Servicio de vehículos no disponible.');
      }
      const data = await response.json();
      if (!data.exists) {
        throw new BadRequestException(`El vehículo con ID ${trimmedVehicleId} no existe.`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('No se pudo comunicar con el servicio de vehículos para validar el vehicleId.');
    }
  }

  async create(createAsignacionDto: CreateAsignacionDto): Promise<Asignacion> {
    const userId = createAsignacionDto.userId.trim();
    const vehicleId = createAsignacionDto.vehicleId.trim();

    // 1. Validaciones externas
    await this.validateUser(userId);
    await this.validateVehicle(vehicleId);

    // 2. Validar que el vehículo no esté ya asignado de forma activa a otro usuario
    const activeAssign = await this.asignacionRepository.findOne({
      where: { vehicleId, active: true },
    });
    if (activeAssign && activeAssign.userId !== userId) {
      throw new ConflictException(
        `El vehículo con ID ${vehicleId} ya está asignado de forma activa a otro propietario.`,
      );
    }

    // 3. Crear o actualizar asignación existente (clave compuesta)
    const existing = await this.asignacionRepository.findOne({
      where: { userId, vehicleId },
    });

    if (existing) {
      if (existing.active) {
        throw new ConflictException('Esta asignación ya existe y se encuentra activa.');
      }
      existing.active = true;
      return this.asignacionRepository.save(existing);
    }

    const newAssign = this.asignacionRepository.create({
      userId,
      vehicleId,
      active: true,
    });
    return this.asignacionRepository.save(newAssign);
  }

  async update(
    userId: string,
    vehicleId: string,
    updateAsignacionDto: UpdateAsignacionDto,
  ): Promise<Asignacion> {
    const trimmedUserId = userId.trim();
    const trimmedVehicleId = vehicleId.trim();

    const assign = await this.asignacionRepository.findOne({
      where: { userId: trimmedUserId, vehicleId: trimmedVehicleId },
    });
    if (!assign) {
      throw new NotFoundException(`Asignación no encontrada para el usuario ${trimmedUserId} y vehículo ${trimmedVehicleId}.`);
    }

    if (updateAsignacionDto.active === true && !assign.active) {
      // Validar si el vehículo está activo en otra asignación
      const activeAssign = await this.asignacionRepository.findOne({
        where: { vehicleId: trimmedVehicleId, active: true },
      });
      if (activeAssign && activeAssign.userId !== trimmedUserId) {
        throw new ConflictException(
          `El vehículo con ID ${trimmedVehicleId} ya está asignado de forma activa a otro propietario.`,
        );
      }
    }

    if (updateAsignacionDto.active !== undefined) {
      assign.active = updateAsignacionDto.active;
    }

    return this.asignacionRepository.save(assign);
  }

  async remove(userId: string, vehicleId: string): Promise<void> {
    const trimmedUserId = userId.trim();
    const trimmedVehicleId = vehicleId.trim();

    // La eliminación lógica busca que la asignación esté activa
    const assign = await this.asignacionRepository.findOne({
      where: { userId: trimmedUserId, vehicleId: trimmedVehicleId, active: true },
    });
    if (!assign) {
      throw new NotFoundException(`Asignación no encontrada para el usuario ${trimmedUserId} y vehículo ${trimmedVehicleId}.`);
    }
    assign.active = false;
    await this.asignacionRepository.save(assign);
  }

  async getFleetByOwner(propietarioId: string): Promise<any[]> {
    const trimmedPropietarioId = propietarioId.trim();

    // 1. Obtener todas las asignaciones activas de este usuario
    const asignaciones = await this.asignacionRepository.find({
      where: { userId: trimmedPropietarioId, active: true },
    });

    const fleet: any[] = [];

    // 2. Comunicarse con vehiculos-app para enriquecer cada vehículo
    for (const assign of asignaciones) {
      try {
        const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/obtener/${assign.vehicleId}`);
        if (response.ok) {
          const vehicleData = await response.json();

          // Mapear Tipo
          let mappedType = 'Automóvil';
          const rawType = (vehicleData.tipo || '').toLowerCase();
          if (rawType === 'moto') {
            mappedType = 'Moto';
          } else if (rawType === 'camioneta') {
            mappedType = 'Camioneta';
          } else if (rawType === 'auto') {
            mappedType = 'Automóvil';
          }

          // Mapear Categoría
          let mappedCategory = 'Combustión';
          const rawClassification = vehicleData.classification;
          if (rawClassification === 'Electrico') {
            mappedCategory = 'Eléctrico';
          } else if (rawClassification === 'Hibrido') {
            mappedCategory = 'Híbrido';
          } else if (rawClassification === 'Gasolina' || rawClassification === 'Diesel') {
            mappedCategory = 'Combustión';
          }

          fleet.push({
            userId: assign.userId,
            vehicleId: assign.vehicleId,
            plate: vehicleData.plate,
            brand: vehicleData.brand,
            model: vehicleData.model,
            color: vehicleData.color,
            year: vehicleData.year,
            type: mappedType,
            category: mappedCategory,
            active: assign.active,
            createdAt: assign.createdAt,
          });
        } else {
          // Si el vehículo no existe en el catálogo pero la asignación sigue registrada
          fleet.push({
            userId: assign.userId,
            vehicleId: assign.vehicleId,
            error: 'Vehículo no encontrado en el servicio de catálogo.',
            active: assign.active,
          });
        }
      } catch (error) {
        fleet.push({
          userId: assign.userId,
          vehicleId: assign.vehicleId,
          error: 'No se pudo comunicar con el servicio de vehículos para obtener detalles.',
          active: assign.active,
        });
      }
    }

    return fleet;
  }

  async getAuditLogs(): Promise<Auditoria[]> {
    return this.auditoriaRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async getAuditLogsByVehicle(vehicleId: string): Promise<Auditoria[]> {
    const trimmedVehicleId = vehicleId.trim();
    return this.auditoriaRepository.find({
      where: { vehicleId: trimmedVehicleId },
      order: { timestamp: 'DESC' },
    });
  }

  async getAuditLogsByOwner(userId: string): Promise<Auditoria[]> {
    const trimmedUserId = userId.trim();
    return this.auditoriaRepository.find({
      where: { userId: trimmedUserId },
      order: { timestamp: 'DESC' },
    });
  }
}
