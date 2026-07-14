import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import { RolesGuard } from '../validators/roles.guard';
import { AuditInterceptor } from '../validators/audit.interceptor';

@Controller('vehiculos')
@UseGuards(RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get('internal/validar/:id')
  async validateVehicle(@Param('id') id: string) {
    try {
      const vehicle = await this.vehicleService.findOne(id);
      return { exists: true, type: vehicle.getType().toUpperCase() };
    } catch (e) {
      return { exists: false };
    }
  }

  @Post('crear')
  @UseInterceptors(AuditInterceptor)
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @Get('listar')
  findAll() {
    return this.vehicleService.findAll();
  }

  @Get('obtener/:id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Patch('actualizar/:id')
  @UseInterceptors(AuditInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete('eliminar/:id')
  @UseInterceptors(AuditInterceptor)
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
