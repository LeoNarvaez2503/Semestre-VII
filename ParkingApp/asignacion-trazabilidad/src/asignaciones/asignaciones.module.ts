import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacion.entity';
import { Auditoria } from './entities/auditoria.entity';
import { AsignacionService } from './services/asignacion.service';
import { AsignacionController } from './controllers/asignacion.controller';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { EventPublisher } from './services/event-publisher.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asignacion, Auditoria])],
  controllers: [AsignacionController],
  providers: [AsignacionService, AuditInterceptor, EventPublisher],
  exports: [AsignacionService, EventPublisher],
})
export class AsignacionesModule {}
