import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import Vehicle from '../entities/vehicle.entity';
export declare class VehicleFactory {
    static create(dto: CreateVehicleDto): Vehicle;
}
