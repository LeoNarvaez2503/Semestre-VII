import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Body,
  Param,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AsignacionService } from '../services/asignacion.service';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto';
import { AuditInterceptor } from '../interceptors/audit.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Asignaciones')
@Controller('asignaciones')
export class AsignacionController {
  constructor(private readonly asignacionService: AsignacionService) {}

  @Post()
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ summary: 'Asociar uno o varios vehículos a un propietario' })
  @ApiResponse({ status: 201, description: 'Asignación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o error de validación en servicios externos' })
  @ApiResponse({ status: 409, description: 'El vehículo ya está asignado de forma activa a otro propietario' })
  create(@Body() createAsignacionDto: CreateAsignacionDto) {
    return this.asignacionService.create(createAsignacionDto);
  }

  @Put(':userId/:vehicleId')
  @UseInterceptors(AuditInterceptor)
  @ApiOperation({ summary: 'Modificar los campos de una asignación' })
  @ApiResponse({ status: 200, description: 'Asignación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 409, description: 'El vehículo ya está asignado de forma activa a otro propietario' })
  update(
    @Param('userId') userId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() updateAsignacionDto: UpdateAsignacionDto,
  ) {
    return this.asignacionService.update(userId, vehicleId, updateAsignacionDto);
  }

  @Delete(':userId/:vehicleId')
  @UseInterceptors(AuditInterceptor)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar físicamente una asignación' })
  @ApiResponse({ status: 204, description: 'Asignación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  async remove(
    @Param('userId') userId: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    await this.asignacionService.remove(userId, vehicleId);
  }

  @Get('propietario/:propietarioId')
  @ApiOperation({ summary: 'Consultar la flota asignada a un propietario y enriquecer datos de vehículos' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos asignados con tipo y categoría enriquecidos' })
  getFleetByOwner(@Param('propietarioId') propietarioId: string) {
    return this.asignacionService.getFleetByOwner(propietarioId);
  }
}
