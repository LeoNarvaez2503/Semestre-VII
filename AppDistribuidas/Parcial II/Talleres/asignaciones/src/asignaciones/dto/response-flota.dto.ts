import { ApiProperty } from '@nestjs/swagger';

export class VehiculoFlotaDto {
  @ApiProperty({ example: 'b1ffcd00-1d2c-4ef9-cc7e-7cc0ce491b22' })
  vehicleId!: string;

  @ApiProperty({ example: 'PCG1234' })
  placa!: string;

  @ApiProperty({ example: 'Chevrolet' })
  marca!: string;

  @ApiProperty({ example: 'Sail' })
  modelo!: string;

  @ApiProperty({ example: 2020 })
  anio!: number;

  @ApiProperty({ example: 'Rojo' })
  color!: string;

  @ApiProperty({ example: 'AUTO' })
  tipo!: string;

  @ApiProperty({ example: 'Gasolina' })
  clasificacion!: string;

  @ApiProperty({ example: '2026-06-24T09:30:00-05:00' })
  fechaAsignacion!: Date;
}

export class ResponseFlotaDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  userId!: string;

  @ApiProperty({ type: [VehiculoFlotaDto] })
  vehiculos!: VehiculoFlotaDto[];

  @ApiProperty({ example: 1 })
  totalVehiculos!: number;
}
