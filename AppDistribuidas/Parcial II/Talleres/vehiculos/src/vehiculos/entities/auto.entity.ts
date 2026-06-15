import { Column, ChildEntity } from 'typeorm/browser';
import Vehiculo from './vehiculo.entity';

@ChildEntity('auto')
export class Auto extends Vehiculo {
  @Column()
  numeroPuertas!: number;

  @Column()
  capacidadMaletero!: number;
  obtenerTipo(): string {
    return 'auto';
  }
}
