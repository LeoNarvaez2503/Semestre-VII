import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesModule } from './asignaciones/asignaciones.module.js';
import { Asignacion } from './asignaciones/entities/asignacion.entity.js';
import { AuditoriaAsignacion } from './asignaciones/entities/auditoria.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 5432)),
        username: configService.get<string>('DB_USUARIO', 'postgres'),
        password: configService.get<string>('DB_CONTRASENA', ''),
        database: configService.get<string>('DB_NOMBRE', 'asignaciones_db'),
        entities: [Asignacion, AuditoriaAsignacion],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AsignacionesModule,
  ],
})
export class AppModule {}
