import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAsignacionDto {
  @ApiProperty({ example: true, description: 'Estado activo de la asignación', required: false })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
