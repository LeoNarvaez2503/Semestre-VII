import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaAsignacion } from '../entities/auditoria.entity.js';
import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';

export interface RegistroAuditoriaParams {
  userId: string;
  vehicleId: string;
  accion: AccionAuditoria;
  payload?: Record<string, any> | null;
}

@Injectable()
export class AuditoriaService {
  private readonly logger = new Logger(AuditoriaService.name);

  constructor(
    @InjectRepository(AuditoriaAsignacion)
    private readonly auditoriaRepository: Repository<AuditoriaAsignacion>,
  ) {}

  /**
   * Registra un evento de auditoría de forma asíncrona.
   * No lanza excepciones para no interrumpir el flujo principal.
   */
  async registrar(params: RegistroAuditoriaParams): Promise<AuditoriaAsignacion> {
    try {
      const evento = this.auditoriaRepository.create({
        userId: params.userId,
        vehicleId: params.vehicleId,
        accion: params.accion,
        payload: params.payload ?? null,
      });

      const saved = await this.auditoriaRepository.save(evento);
      this.logger.log(
        `Auditoría registrada: ${params.accion} para user=${params.userId}, vehicle=${params.vehicleId}`,
      );
      return saved;
    } catch (error) {
      this.logger.error(`Error al registrar auditoría: ${error}`);
      throw error;
    }
  }

  /**
   * Obtiene todos los eventos de auditoría ordenados por timestamp descendente.
   */
  async listarTodos(): Promise<AuditoriaAsignacion[]> {
    return this.auditoriaRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  /**
   * Obtiene los eventos de auditoría para una clave compuesta específica.
   */
  async listarPorAsignacion(userId: string, vehicleId: string): Promise<AuditoriaAsignacion[]> {
    return this.auditoriaRepository.find({
      where: { userId, vehicleId },
      order: { timestamp: 'DESC' },
    });
  }
}
