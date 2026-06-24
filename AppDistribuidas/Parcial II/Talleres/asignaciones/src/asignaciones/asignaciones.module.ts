import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asignacion } from './entities/asignacion.entity.js';
import { AuditoriaAsignacion } from './entities/auditoria.entity.js';
import { AsignacionService } from './services/asignacion.service.js';
import { AuditoriaService } from './services/auditoria.service.js';
import { VehiculoClientService } from './services/vehiculo-client.service.js';
import { AsignacionController } from './controllers/asignacion.controller.js';
import { FlotaController } from './controllers/flota.controller.js';
import { AuditoriaInterceptor } from './interceptors/auditoria.interceptor.js';

@Module({
  imports: [TypeOrmModule.forFeature([Asignacion, AuditoriaAsignacion])],
  controllers: [AsignacionController, FlotaController],
  providers: [
    AsignacionService,
    AuditoriaService,
    VehiculoClientService,
    AuditoriaInterceptor,
  ],
  exports: [AsignacionService, AuditoriaService],
})
export class AsignacionesModule {}
