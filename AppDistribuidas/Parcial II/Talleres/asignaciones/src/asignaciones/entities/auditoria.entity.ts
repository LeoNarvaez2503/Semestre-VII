import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';

@Entity({ name: 'auditoria_asignacion' })
export class AuditoriaAsignacion {
  @ApiProperty({
    example: 'c2ggde11-2e3d-5fg0-dd8f-8dd1df502c33',
    description: 'ID único del evento de auditoría (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    description: 'ID del usuario afectado (parte de la clave compuesta)',
  })
  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @ApiProperty({
    example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
    description: 'ID del vehículo afectado (parte de la clave compuesta)',
  })
  @Column({ type: 'uuid', name: 'vehicle_id' })
  vehicleId!: string;

  @ApiProperty({
    enum: AccionAuditoria,
    example: AccionAuditoria.CREACION,
    description: 'Tipo de acción realizada (CREACION, MODIFICACION, ELIMINACION)',
  })
  @Column({ name: 'accion', type: 'enum', enum: AccionAuditoria })
  accion!: AccionAuditoria;

  @ApiProperty({
    example: '2026-06-24T14:30:00.000Z',
    description: 'Timestamp exacto del evento con zona horaria',
  })
  @Column({
    name: 'timestamp',
    type: 'timestamptz',
    default: () => 'NOW()',
  })
  timestamp!: Date;

  @ApiProperty({
    example: { anterior: { activo: true }, nuevo: { activo: false } },
    description: 'Payload con los datos anteriores vs. nuevos del cambio',
    required: false,
  })
  @Column({ name: 'payload', type: 'jsonb', nullable: true })
  payload!: Record<string, any> | null;
}
