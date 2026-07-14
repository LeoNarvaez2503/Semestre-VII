import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsignacionesModule } from './asignaciones/asignaciones.module';
import { Asignacion } from './asignaciones/entities/asignacion.entity';
import { Auditoria } from './asignaciones/entities/auditoria.entity';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { SseModule } from './sse/sse.module';

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
        port: Number(configService.get('DB_PORT', 5434)),
        username: configService.get<string>('DB_USUARIO', 'admin'),
        password: configService.get<string>('DB_CONTRASENA', 'adminpassword'),
        database: configService.get<string>('DB_NOMBRE', 'asignaciones_db'),
        entities: [Asignacion, Auditoria],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    AsignacionesModule,
    RabbitMQModule,
    SseModule,
  ],
})
export class AppModule {}
