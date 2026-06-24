import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';
export declare class AuditoriaAsignacion {
    id: string;
    userId: string;
    vehicleId: string;
    accion: AccionAuditoria;
    timestamp: Date;
    payload: Record<string, any> | null;
}
