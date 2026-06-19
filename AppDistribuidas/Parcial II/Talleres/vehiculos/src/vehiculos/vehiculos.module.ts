import { Module } from '@nestjs/common';
import { VehicleService } from './services/vehicle.service';
import { VehicleController } from './controllers/vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Vehicle from './entities/vehicle.entity';
import { Car } from './entities/car.entity';
import { Motorcycle } from './entities/motorcycle.entity';
import { Truck } from './entities/truck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Car, Motorcycle, Truck])],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehiculosModule {}
