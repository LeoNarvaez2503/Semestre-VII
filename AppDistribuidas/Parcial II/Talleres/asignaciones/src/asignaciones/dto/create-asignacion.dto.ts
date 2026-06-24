import { IsUUID, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAsignacionDto {
  @ApiProperty({
    description: 'ID del usuario/propietario (UUID)',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: 'El userId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El userId no puede estar vacío' })
  userId!: string;

  @ApiProperty({
    description: 'ID del vehículo a asignar (UUID)',
    example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22',
  })
  @IsUUID('4', { message: 'El vehicleId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El vehicleId no puede estar vacío' })
  vehicleId!: string;

  @ApiProperty({
    description: 'Notas opcionales sobre la asignación',
    example: 'Asignación inicial del vehículo',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto' })
  @MaxLength(500, { message: 'Las notas no pueden exceder 500 caracteres' })
  notas?: string;
}
