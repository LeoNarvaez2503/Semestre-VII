import { Column, ChildEntity } from 'typeorm/browser';
import Vehiculo from './vehiculo.entity';

@ChildEntity('Auto')
export class Auto extends Vehiculo {
  @Column()
  numeroPuertas!: number;

  @Column()
  capacidadMaletero!: number;
  obtenerTipo(): string {
    return 'Auto';
  }
}
