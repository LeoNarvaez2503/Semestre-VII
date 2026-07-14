import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureHttpApp } from '../../../libs/common/src/bootstrap';
import { TransaccionesModule } from './transacciones.module';

async function bootstrap() {
  const app = await NestFactory.create(TransaccionesModule);
  configureHttpApp(app);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>('TRANSACCIONES_PORT', 4003));
}

bootstrap();
