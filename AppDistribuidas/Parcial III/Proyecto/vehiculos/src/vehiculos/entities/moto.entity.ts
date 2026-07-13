import { Column, ChildEntity } from 'typeorm/browser';
import Vehiculo from './vehiculo.entity';

export enum TipoMoto {
  DEPORTIVA = 'Deportiva',
  SCOOTER = 'Scooter',
  MOTOCROSS = 'Motocross',
}

@ChildEntity('moto')
export class Moto extends Vehiculo {
  @Column({ type: 'enum', enum: TipoMoto })
  tipoMoto!: TipoMoto;

  obtenerTipo(): string {
    return 'moto';
  }
}
