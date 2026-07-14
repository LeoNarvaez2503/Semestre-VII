import { Column, ChildEntity } from 'typeorm';
import Vehicle from './vehicle.entity';

@ChildEntity('camioneta')
export class Truck extends Vehicle {
  @Column({ name: 'cabina', type: 'int' })
  cabin!: number;

  @Column({ name: 'capacidadCarga' })
  loadCapacity!: number;

  getType(): string {
    return 'camioneta';
  }
}
