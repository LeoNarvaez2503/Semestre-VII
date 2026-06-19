import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  TableInheritance,
} from 'typeorm';

export enum Classification {
  ELECTRICO = 'Electrico',
  HIBRIDO = 'Hibrido',
  GASOLINA = 'Gasolina',
  DIESEL = 'Diesel',
}

@Entity({ name: 'vehiculo' })
@TableInheritance({ column: { type: 'varchar', name: 'tipo' } })
export default abstract class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'placa', unique: true })
  plate!: string;

  @Column({ name: 'marca' })
  brand!: string;

  @Column({ name: 'modelo' })
  model!: string;

  @Column({ name: 'color' })
  color!: string;

  @Column({ name: 'anio' })
  year!: number;

  @Column({ name: 'clasificacion', type: 'enum', enum: Classification })
  classification!: Classification;

  abstract getType(): string;
}
