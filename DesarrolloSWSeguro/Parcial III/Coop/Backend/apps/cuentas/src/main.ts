import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CuentasModule } from './cuentas.module';
import { configureHttpApp } from '../../../libs/common/src/bootstrap';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(CuentasModule);
  configureHttpApp(app);
  const config = app.get(ConfigService);

  // TCP Transport
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: config.get<number>('TCP_PORT', 4002),
    },
  });

  // Redis Transport for Async Events
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: config.get<string>('REDIS_HOST', 'localhost'),
      port: config.get<number>('REDIS_PORT', 6379),
    },
  });

  await app.startAllMicroservices();
  await app.listen(config.get<number>('CUENTAS_PORT', 4002));
}

bootstrap();
