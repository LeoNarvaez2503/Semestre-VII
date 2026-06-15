import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import Vehiculo from './vehiculos/entities/vehiculo.entity';
import { Auto } from './vehiculos/entities/auto.entity';
import { Moto } from './vehiculos/entities/moto.entity';
import { Camioneta } from './vehiculos/entities/camioneta.entity';

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
        database: configService.get<string>('DB_NOMBRE', 'vehiculos'),
        entities: [Vehiculo, Auto, Moto, Camioneta],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    VehiculosModule,
  ],
})
export class AppModule {}
