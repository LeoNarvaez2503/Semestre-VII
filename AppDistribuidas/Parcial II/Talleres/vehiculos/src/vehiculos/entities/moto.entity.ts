import { Column, ChildEntity } from 'typeorm/browser';
import Vehiculo from './vehiculo.entity';

export enum TipoMoto {
  DEPORTIVA = 'Deportiva',
  SCOOTER = 'Scooter',
  MOTOCROSS = 'Motocross',
}

@ChildEntity('Moto')
export class Moto extends Vehiculo {
  @Column({ type: 'enum', enum: TipoMoto })
  tipo!: TipoMoto;

  obtenerTipo(): string {
    return 'Moto';
  }
}
