import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'auditorias' })
export class Auditoria {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'ID único del evento de auditoría' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del propietario de la clave compuesta afectada' })
  @Column('uuid', { name: 'user_id' })
  userId!: string;

  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'ID del vehículo de la clave compuesta afectada' })
  @Column('uuid', { name: 'vehicle_id' })
  vehicleId!: string;

  @ApiProperty({ example: 'CREACION', description: 'Tipo de acción (CREACION, MODIFICACION, ELIMINACION)' })
  @Column({ name: 'tipo_accion' })
  tipoAccion!: string;

  @ApiProperty({ description: 'Timestamp del evento con zona horaria' })
  @Column('timestamptz', { name: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;

  @ApiProperty({ description: 'Payload del cambio conteniendo estado anterior y nuevo' })
  @Column('jsonb', { name: 'payload' })
  payload!: {
    previousState: any;
    newState: any;
  };
}
