import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import Vehiculo from './entities/vehiculo.entity';
import { Repository } from 'typeorm';
import { FactoryVehiculos } from './factory/factory-vehiculo';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private repositoryVehiculo: Repository<Vehiculo>,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const existe = await this.repositoryVehiculo.findOne({
      where: {
        placa: createVehiculoDto.datos.placa,
      },
    });
    if (existe) {
      throw new ConflictException('Vehiculo ya existe');
    }
    const vehiculo = FactoryVehiculos.crear(createVehiculoDto);
    return this.repositoryVehiculo.save(vehiculo);
  }

  async findAll(): Promise<Vehiculo[]> {
    return this.repositoryVehiculo.find();
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.repositoryVehiculo.findOne({
      where: {
        id: id,
      },
    });
    if (!vehiculo) {
      throw new NotFoundException('Vehiculo no encontrado');
    }
    return vehiculo;
  }

  async update(
    id: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id);
    if (updateVehiculoDto.datos) {
      const datos = updateVehiculoDto.datos;
      if (datos.placa && datos.placa !== vehiculo.placa) {
        const existe = await this.repositoryVehiculo.findOne({
          where: { placa: datos.placa },
        });
        if (existe && existe.id !== id) {
          throw new ConflictException(
            'La placa ya está registrada por otro vehículo',
          );
        }
      }
      Object.assign(vehiculo, datos);
    }
    return this.repositoryVehiculo.save(vehiculo);
  }

  async remove(id: string): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.repositoryVehiculo.remove(vehiculo);
  }
}
