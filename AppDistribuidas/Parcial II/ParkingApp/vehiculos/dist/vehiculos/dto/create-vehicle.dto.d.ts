import { Classification } from '../entities/vehicle.entity';
export declare class BaseVehicleDto {
    plate: string;
    brand: string;
    model: string;
    color: string;
    year: number;
    classification: Classification;
}
export declare class CarDto extends BaseVehicleDto {
    doors: number;
    fuelType: string;
    trunkCapacity: number;
}
export declare class MotorcycleDto extends BaseVehicleDto {
    plate: string;
    type: string;
}
export declare class TruckDto extends BaseVehicleDto {
    cabin: number;
    loadCapacity: number;
}
export declare class CreateVehicleDto {
    type: string;
    data: CarDto | MotorcycleDto | TruckDto;
}
