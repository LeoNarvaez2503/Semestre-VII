import { Car } from '../entities/car.entity';
import { Motorcycle, MotorcycleType } from '../entities/motorcycle.entity';
import { Truck } from '../entities/truck.entity';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import Vehicle from '../entities/vehicle.entity';

export class VehicleFactory {
  static create(dto: CreateVehicleDto): Vehicle {
    const type = dto.type.toLowerCase();

    switch (type) {
      case 'auto':
      case 'car': {
        const car = new Car();
        const d = dto.data as any;
        car.plate = d.plate;
        car.brand = d.brand;
        car.model = d.model;
        car.color = d.color;
        car.year = d.year;
        car.classification = d.classification;
        car.doors = d.doors;
        car.fuelType = d.fuelType;
        car.trunkCapacity = d.trunkCapacity;
        return car;
      }
      case 'moto':
      case 'motorcycle': {
        const moto = new Motorcycle();
        const d = dto.data as any;
        moto.plate = d.plate;
        moto.brand = d.brand;
        moto.model = d.model;
        moto.color = d.color;
        moto.year = d.year;
        moto.classification = d.classification;
        moto.motorcycleType = d.type as MotorcycleType;
        return moto;
      }
      case 'camioneta':
      case 'truck': {
        const truck = new Truck();
        const d = dto.data as any;
        truck.plate = d.plate;
        truck.brand = d.brand;
        truck.model = d.model;
        truck.color = d.color;
        truck.year = d.year;
        truck.classification = d.classification;
        truck.cabin = d.cabin;
        truck.loadCapacity = d.loadCapacity;
        return truck;
      }
      default:
        throw new Error(`Vehicle type not supported: ${dto.type}`);
    }
  }
}
