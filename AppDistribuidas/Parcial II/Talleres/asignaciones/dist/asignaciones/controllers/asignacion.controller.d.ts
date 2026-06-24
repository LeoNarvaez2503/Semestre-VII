import { AsignacionService } from '../services/asignacion.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto.js';
export declare class AsignacionController {
    private readonly asignacionService;
    private readonly auditoriaService;
    constructor(asignacionService: AsignacionService, auditoriaService: AuditoriaService);
    crear(dto: CreateAsignacionDto): Promise<import("../entities/asignacion.entity.js").Asignacion>;
    actualizar(dto: UpdateAsignacionDto): Promise<import("../entities/asignacion.entity.js").Asignacion>;
    eliminar(userId: string, vehicleId: string): Promise<{
        message: string;
    }>;
    listar(): Promise<import("../entities/asignacion.entity.js").Asignacion[]>;
    listarAuditoria(): Promise<import("../entities/auditoria.entity.js").AuditoriaAsignacion[]>;
    obtenerAuditoria(userId: string, vehicleId: string): Promise<import("../entities/auditoria.entity.js").AuditoriaAsignacion[]>;
}
