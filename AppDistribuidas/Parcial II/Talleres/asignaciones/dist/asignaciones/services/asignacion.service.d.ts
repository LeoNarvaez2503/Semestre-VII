import { Repository } from 'typeorm';
import { Asignacion } from '../entities/asignacion.entity.js';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto.js';
import { VehiculoClientService } from './vehiculo-client.service.js';
import { AuditoriaService } from './auditoria.service.js';
import { ResponseFlotaDto } from '../dto/response-flota.dto.js';
export declare class AsignacionService {
    private readonly asignacionRepository;
    private readonly vehiculoClient;
    private readonly auditoriaService;
    constructor(asignacionRepository: Repository<Asignacion>, vehiculoClient: VehiculoClientService, auditoriaService: AuditoriaService);
    crear(dto: CreateAsignacionDto): Promise<Asignacion>;
    actualizar(dto: UpdateAsignacionDto): Promise<Asignacion>;
    eliminar(userId: string, vehicleId: string): Promise<{
        message: string;
    }>;
    listarTodas(): Promise<Asignacion[]>;
    obtenerFlota(userId: string): Promise<ResponseFlotaDto>;
}
