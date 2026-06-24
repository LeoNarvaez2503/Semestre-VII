import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AsignacionService } from '../services/asignacion.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
import { CreateAsignacionDto } from '../dto/create-asignacion.dto.js';
import { UpdateAsignacionDto } from '../dto/update-asignacion.dto.js';
import { AuditoriaInterceptor } from '../interceptors/auditoria.interceptor.js';

@ApiTags('Asignaciones')
@Controller('asignaciones')
@UseInterceptors(AuditoriaInterceptor)
export class AsignacionController {
  constructor(
    private readonly asignacionService: AsignacionService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Post('crear')
  @ApiOperation({ summary: 'Crear una asignación de vehículo a propietario' })
  @ApiResponse({ status: 201, description: 'Asignación creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario/vehículo no existe.' })
  @ApiResponse({ status: 409, description: 'El vehículo ya está asignado a otro propietario.' })
  crear(@Body() dto: CreateAsignacionDto) {
    return this.asignacionService.crear(dto);
  }

  @Patch('actualizar')
  @ApiOperation({ summary: 'Modificar o transferir una asignación' })
  @ApiResponse({ status: 200, description: 'Asignación actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada.' })
  actualizar(@Body() dto: UpdateAsignacionDto) {
    return this.asignacionService.actualizar(dto);
  }

  @Delete('eliminar/:userId/:vehicleId')
  @ApiOperation({ summary: 'Eliminar (desactivar) una asignación' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Asignación activa no encontrada.' })
  eliminar(
    @Param('userId') userId: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.asignacionService.eliminar(userId, vehicleId);
  }

  @Get('listar')
  @ApiOperation({ summary: 'Listar todas las asignaciones' })
  @ApiResponse({ status: 200, description: 'Lista de asignaciones.' })
  listar() {
    return this.asignacionService.listarTodas();
  }

  @Get('auditoria/listar')
  @ApiOperation({ summary: 'Listar todos los eventos de auditoría' })
  @ApiResponse({ status: 200, description: 'Lista de eventos de auditoría.' })
  listarAuditoria() {
    return this.auditoriaService.listarTodos();
  }

  @Get('auditoria/:userId/:vehicleId')
  @ApiOperation({ summary: 'Obtener auditoría de una asignación específica' })
  @ApiResponse({ status: 200, description: 'Eventos de auditoría de la asignación.' })
  obtenerAuditoria(
    @Param('userId') userId: string,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.auditoriaService.listarPorAsignacion(userId, vehicleId);
  }
}
