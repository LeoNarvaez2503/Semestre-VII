import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    create(createVehicleDto: CreateVehicleDto): Promise<import("../entities/vehicle.entity").default>;
    findAll(): Promise<import("../entities/vehicle.entity").default[]>;
    findOne(id: string): Promise<import("../entities/vehicle.entity").default>;
    update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<import("../entities/vehicle.entity").default>;
    remove(id: string): Promise<void>;
}
