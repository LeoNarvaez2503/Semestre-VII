import { ConfigService } from '@nestjs/config';
export interface ValidacionUsuario {
    exists: boolean;
    active?: boolean;
}
export interface ValidacionVehiculo {
    exists: boolean;
    type?: string;
}
export interface DetalleVehiculo {
    id: string;
    plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    classification: string;
    tipo: string;
    [key: string]: any;
}
export declare class VehiculoClientService {
    private readonly configService;
    private readonly logger;
    private readonly usuariosApiUrl;
    private readonly vehiculosApiUrl;
    constructor(configService: ConfigService);
    validarUsuario(userId: string): Promise<ValidacionUsuario>;
    validarVehiculo(vehicleId: string): Promise<ValidacionVehiculo>;
    obtenerDetalleVehiculo(vehicleId: string): Promise<DetalleVehiculo | null>;
}
