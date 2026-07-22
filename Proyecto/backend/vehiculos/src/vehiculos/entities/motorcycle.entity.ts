import { Column, ChildEntity } from 'typeorm';
import Vehicle from './vehicle.entity';

export enum MotorcycleType {
  DEPORTIVA = 'Deportiva',
  SCOOTER = 'Scooter',
  MOTOCROSS = 'Motocross',
  CUSTOM = 'Custom',
  CRUISER = 'Cruiser',
}

@ChildEntity('moto')
export class Motorcycle extends Vehicle {
  @Column({ name: 'tipoMoto', type: 'enum', enum: MotorcycleType })
  motorcycleType!: MotorcycleType;

  getType(): string {
    return 'moto';
  }
}
