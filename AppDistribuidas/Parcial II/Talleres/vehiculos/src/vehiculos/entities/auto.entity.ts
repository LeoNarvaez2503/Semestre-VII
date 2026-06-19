import { Column, ChildEntity } from 'typeorm';
import Vehiculo from './vehiculo.entity';

@ChildEntity('auto')
export class Auto extends Vehiculo {
  @Column()
  puertas!: number;

  @Column()
  capacidadMaletero!: number;

  @Column()
  tipoCombustible!: string;

  obtenerTipo(): string {
    return 'auto';
  }
}
