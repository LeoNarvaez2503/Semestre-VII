import Vehicle from '../entities/vehicle.entity';

export class ResponseVehicleDto {
  id!: string;
  plate!: string;
  brand!: string;
  model!: string;
  year!: number;
  color!: string;
  classification!: string;
  type!: string;
  cabin?: number;
  loadCapacity?: number;
  doors?: number;
  fuelType?: string;
  trunkCapacity?: number;
}
