import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { configureHttpApp } from '../../../libs/common/src/bootstrap';
import { CuentasModule } from './cuentas.module';

async function bootstrap() {
  const app = await NestFactory.create(CuentasModule);
  configureHttpApp(app);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>('CUENTAS_PORT', 4002));
}

bootstrap();
