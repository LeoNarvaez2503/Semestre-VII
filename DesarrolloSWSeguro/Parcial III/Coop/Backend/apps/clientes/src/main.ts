import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ClientesModule } from './clientes.module';
import { configureHttpApp } from '../../../libs/common/src/bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(ClientesModule);
  configureHttpApp(app);
  const config = app.get(ConfigService);
  await app.listen(config.get<number>('CLIENTES_PORT', 4001));
}

bootstrap();
