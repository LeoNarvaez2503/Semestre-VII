import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditConsumer } from './audit.consumer';
import { EventoAuditoria } from './entities/evento-auditoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventoAuditoria])],
  controllers: [AuditController],
  providers: [AuditService, AuditConsumer],
  exports: [AuditService],
})
export class AuditModule { }