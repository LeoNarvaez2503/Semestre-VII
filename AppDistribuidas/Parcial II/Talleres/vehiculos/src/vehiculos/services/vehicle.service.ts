import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import Vehicle from '../entities/vehicle.entity';
import { Repository, ILike } from 'typeorm';
import { VehicleFactory } from '../factory/vehicle.factory';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const exists = await this.vehicleRepository.findOne({
      where: {
        plate: ILike(createVehicleDto.data.plate),
      },
    });
    if (exists) {
      throw new ConflictException('El vehículo ya está registrado.');
    }

    // Contrato Interno: Validar con usuarios-api
    try {
      const response = await fetch(`http://usuarios-api:8000/usuarios/internal/validar/${createVehicleDto.data.propietarioId}`);
      if (!response.ok) {
        throw new BadRequestException('Error al validar el propietario. Servicio de usuarios no disponible o error interno.');
      }
      const data = await response.json();
      if (!data.exists) {
        throw new BadRequestException(`El usuario con ID ${createVehicleDto.data.propietarioId} no existe.`);
      }
      if (!data.active) {
        throw new BadRequestException(`El usuario con ID ${createVehicleDto.data.propietarioId} está inactivo.`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('No se pudo comunicar con el servicio de usuarios para validar el propietarioId.');
    }

    const vehicle = VehicleFactory.create(createVehicleDto);
    vehicle.propietarioId = createVehicleDto.data.propietarioId; // Assign owner
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find();
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado.');
    }
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    if (updateVehicleDto.data) {
      const data = updateVehicleDto.data;
      if (data.plate && data.plate !== vehicle.plate) {
        const exists = await this.vehicleRepository.findOne({
          where: { plate: ILike(data.plate) },
        });
        if (exists && exists.id !== id) {
          throw new ConflictException(
            'La placa ya está registrada por otro vehículo.',
          );
        }
      }
      
      // Update fields
      if (data.plate) vehicle.plate = data.plate;
      if (data.brand) vehicle.brand = data.brand;
      if (data.model) vehicle.model = data.model;
      if (data.color) vehicle.color = data.color;
      if (data.year) vehicle.year = data.year;
      if (data.classification) vehicle.classification = data.classification;

      // Handle subclass fields
      const anyVehicle = vehicle as any;
      if ('doors' in data) anyVehicle.doors = (data as any).doors;
      if ('trunkCapacity' in data) anyVehicle.trunkCapacity = (data as any).trunkCapacity;
      if ('fuelType' in data) anyVehicle.fuelType = (data as any).fuelType;
      if ('type' in data && vehicle.getType() === 'moto') anyVehicle.motorcycleType = (data as any).type;
      if ('cabin' in data) anyVehicle.cabin = (data as any).cabin;
      if ('loadCapacity' in data) anyVehicle.loadCapacity = (data as any).loadCapacity;
    }
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }
}
