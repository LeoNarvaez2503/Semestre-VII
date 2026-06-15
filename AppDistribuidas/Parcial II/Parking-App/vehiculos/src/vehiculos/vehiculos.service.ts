import { Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VehiculosService {

  constructor(
    @InjectRepository(Vehiculo)
    private repositoryVehiculos: Repository<Vehiculo>
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const existe = await this.repositoryVehiculos.findOne({
      where: {
        placa: createVehiculoDto.datos.placa,
      },
    });
    if (existe) {
      throw new Error(`Ya existe un vehículo con esa placa`);
    }

    const vehiculo = this.repositoryVehiculos.create(createVehiculoDto.datos);
    return this.repositoryVehiculos.save(vehiculo);
  }

  findAll(): Promise<Vehiculo[]> {
    return this.repositoryVehiculos.find();
  }

  async findOne(id: string): Promise<Vehiculo> {

    const existe = await this.repositoryVehiculos.findOne({ 
      where: { 
        id: id,
      },
    });

    if(!existe) throw new Error('Vehiculo no encontrado');
    return existe;
  }

  update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
    return `This action updates a #${id} vehiculo`;
  }

  remove(id: string) {
    return `This action removes a #${id} vehiculo`;
  }
}
