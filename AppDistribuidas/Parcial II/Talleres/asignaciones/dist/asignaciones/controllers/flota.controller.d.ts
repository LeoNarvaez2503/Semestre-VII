import { AsignacionService } from '../services/asignacion.service.js';
import { ResponseFlotaDto } from '../dto/response-flota.dto.js';
export declare class FlotaController {
    private readonly asignacionService;
    constructor(asignacionService: AsignacionService);
    obtenerFlota(userId: string): Promise<ResponseFlotaDto>;
}
