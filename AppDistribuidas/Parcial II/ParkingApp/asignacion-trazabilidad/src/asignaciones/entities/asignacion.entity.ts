import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'asignaciones' })
export class Asignacion {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del propietario (UUID)' })
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId!: string;

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'ID del vehículo (UUID)' })
  @PrimaryColumn('uuid', { name: 'vehicle_id' })
  vehicleId!: string;

  @ApiProperty({ example: true, description: 'Estado activo de la asignación' })
  @Column({ name: 'active', type: 'boolean', default: true })
  active!: boolean;

  @ApiProperty({ description: 'Fecha de creación de la asignación' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización de la asignación' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
