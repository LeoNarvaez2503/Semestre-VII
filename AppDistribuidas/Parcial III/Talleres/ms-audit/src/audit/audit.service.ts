import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { EventoAuditoria } from './entities/evento-auditoria.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(EventoAuditoria)
    private readonly auditRepo: Repository<EventoAuditoria>,
  ) {}

  async create(dto: CreateAuditDto): Promise<EventoAuditoria> {
    const { usuario, ...rest } = dto;
    const mewEvent = this.auditRepo.create({
      ...rest,
      username: usuario,
      timestamp: new Date(),
    });

    return this.auditRepo.save(mewEvent);
  }

  async findAll(): Promise<EventoAuditoria[]> {
    return this.auditRepo.find({ order: { timestamp: 'DESC' } });
  }

  async findOne(id: string): Promise<EventoAuditoria | null> {
    return this.auditRepo.findOne({ where: { id } });
  }

  async update(id: string, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  async remove(id: string) {
    return `This action removes a #${id} audit`;
  }
}
