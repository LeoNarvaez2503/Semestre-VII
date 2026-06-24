import { Repository } from 'typeorm';
import { AuditoriaAsignacion } from '../entities/auditoria.entity.js';
import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';
export interface RegistroAuditoriaParams {
    userId: string;
    vehicleId: string;
    accion: AccionAuditoria;
    payload?: Record<string, any> | null;
}
export declare class AuditoriaService {
    private readonly auditoriaRepository;
    private readonly logger;
    constructor(auditoriaRepository: Repository<AuditoriaAsignacion>);
    registrar(params: RegistroAuditoriaParams): Promise<AuditoriaAsignacion>;
    listarTodos(): Promise<AuditoriaAsignacion[]>;
    listarPorAsignacion(userId: string, vehicleId: string): Promise<AuditoriaAsignacion[]>;
}
