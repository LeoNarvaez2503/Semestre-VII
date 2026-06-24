export declare class VehiculoFlotaDto {
    vehicleId: string;
    placa: string;
    marca: string;
    modelo: string;
    anio: number;
    color: string;
    tipo: string;
    clasificacion: string;
    fechaAsignacion: Date;
}
export declare class ResponseFlotaDto {
    userId: string;
    vehiculos: VehiculoFlotaDto[];
    totalVehiculos: number;
}
