import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import Vehicle from '../entities/vehicle.entity';
import { Repository, ILike } from 'typeorm';
import { VehicleFactory } from '../factory/vehicle.factory';
import { AuditEvent, EventPublisher } from '../event-publisher.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private eventPublisher: EventPublisher,
  ) {}

  // Método auxiliar para publicar eventos
  private async emitEvent(
    accion: string,
    vehiculo: Vehicle,
    datosExtra?: any,
  ) {
    const event: AuditEvent = {
      servicio: 'vehiculos',
      accion,
      entidad: 'Vehiculo',
      datos: { ...vehiculo, ...datosExtra },
      // usuario e ip se podrían obtener del contexto (request) si se inyecta
    };
    await this.eventPublisher.publish(event);
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    const exists = await this.vehicleRepository.findOne({
      where: {
        plate: ILike(createVehicleDto.data.plate),
      },
    });
    if (exists) {
      throw new ConflictException('El vehículo ya está registrado.');
    }

    const vehicle = VehicleFactory.create(createVehicleDto);

    const saved = await this.vehicleRepository.save(vehicle);

    await this.emitEvent('CREATE', saved);
    
    return saved;
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
    const saved = await this.vehicleRepository.save(vehicle);
    await this.emitEvent('UPDATE', saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
    await this.emitEvent('DELETE', vehicle);
  }
}
