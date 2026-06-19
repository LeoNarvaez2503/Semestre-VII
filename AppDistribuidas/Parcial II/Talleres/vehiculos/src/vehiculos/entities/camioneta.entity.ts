import { Column, ChildEntity } from 'typeorm';
import Vehiculo from './vehiculo.entity';

@ChildEntity('camioneta')
export class Camioneta extends Vehiculo {
  @Column({ type: 'int' })
  cabina!: number;

  @Column()
  capacidadCarga!: number;
  obtenerTipo(): string {
    return 'camioneta';
  }
}
