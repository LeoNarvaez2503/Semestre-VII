import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AsignacionService } from '../services/asignacion.service.js';
import { ResponseFlotaDto } from '../dto/response-flota.dto.js';

@ApiTags('Flota')
@Controller('asignaciones')
export class FlotaController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Get('flota/:userId')
  @ApiOperation({
    summary: 'Consultar la flota de vehículos de un propietario (RF3)',
    description:
      'Retorna la lista de vehículos asignados al usuario, con detalle de tipo y categoría obtenidos del microservicio de vehículos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Flota del propietario con detalle de cada vehículo.',
    type: ResponseFlotaDto,
  })
  obtenerFlota(@Param('userId') userId: string): Promise<ResponseFlotaDto> {
    return this.asignacionService.obtenerFlota(userId);
  }
}
