import { TipoMoto } from "../entities/motocicleta.entity";


export class ResponseVehiculoDto {
    id!: string;
    placa!: string
    marca!: string;
    modelo!: string
    color!: string;
    anio!: number
    clasificacion!: string;
    numeroPuertas!: number;
    capacidadMaletero!: number;
    cabina!: string;
    CapacidadCarga!: number;
    tipo!: TipoMoto;
}