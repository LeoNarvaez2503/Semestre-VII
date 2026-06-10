import Vehiculo from '../entities/vehiculo.entity';

export class ResponseVehiculoDto {
  id!: number;
  placa!: string;
  marca!: string;
  modelo!: string;
  anio!: number;
  color!: string;
  clasificacion!: string;
  tipo!: string;
  cabina!: string;
  capacidadCarga!: number;
  numeroPuertas!: number;
  tipoCombustible!: string;
}
