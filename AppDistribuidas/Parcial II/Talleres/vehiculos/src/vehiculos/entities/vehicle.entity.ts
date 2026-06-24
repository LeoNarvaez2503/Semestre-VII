import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'ID único del vehículo (UUID)' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'PCG1234', description: 'Placa del vehículo' })
  @Column({ name: 'placa', unique: true })
  plate!: string;

  @ApiProperty({ example: 'Chevrolet', description: 'Marca del vehículo' })
  @Column({ name: 'marca' })
  brand!: string;

  @ApiProperty({ example: 'Sail', description: 'Modelo del vehículo' })
  @Column({ name: 'modelo' })
  model!: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del vehículo' })
  @Column({ name: 'color' })
  color!: string;

  @ApiProperty({ example: 2020, description: 'Año de fabricación del vehículo' })
  @Column({ name: 'anio' })
  year!: number;

  @ApiProperty({ enum: Classification, example: Classification.GASOLINA, description: 'Clasificación ambiental/combustible del vehículo' })
  @Column({ name: 'clasificacion', type: 'enum', enum: Classification })
  classification!: Classification;

  abstract getType(): string;
}
