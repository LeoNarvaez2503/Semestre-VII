import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'asignacion' })
export class Asignacion {
  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID del usuario/propietario (UUID) — parte de la clave compuesta',
  })
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiProperty({
    example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
    description: 'ID del vehículo (UUID) — parte de la clave compuesta',
  })
  @PrimaryColumn({ type: 'uuid', name: 'vehicle_id' })
  vehicleId!: string;

  @ApiProperty({ example: true, description: 'Estado activo de la asignación' })
  @Column({ name: 'activo', type: 'boolean', default: true })
  activo!: boolean;

  @ApiProperty({
    example: '2026-06-24T09:30:00-05:00',
    description: 'Fecha y hora de la asignación con zona horaria',
  })
  @Column({
    name: 'fecha_asignacion',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  fechaAsignacion!: Date;

  @ApiProperty({
    example: 'Asignación inicial del vehículo',
    description: 'Notas opcionales sobre la asignación',
    required: false,
  })
  @Column({ name: 'notas', type: 'varchar', nullable: true })
  notas!: string | null;
}
