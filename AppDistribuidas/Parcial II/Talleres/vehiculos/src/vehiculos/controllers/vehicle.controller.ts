import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

@Controller('vehiculos')
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
  update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete('eliminar/:id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
