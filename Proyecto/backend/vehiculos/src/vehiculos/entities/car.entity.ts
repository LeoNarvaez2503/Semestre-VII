import { Column, ChildEntity } from 'typeorm';
import Vehicle from './vehicle.entity';

@ChildEntity('auto')
export class Car extends Vehicle {
  @Column({ name: 'puertas' })
  doors!: number;

  @Column({ name: 'capacidadMaletero' })
  trunkCapacity!: number;

  @Column({ name: 'tipoCombustible' })
  fuelType!: string;

  getType(): string {
    return 'auto';
  }
}
