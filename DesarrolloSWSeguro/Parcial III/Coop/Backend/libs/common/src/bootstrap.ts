import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureHttpApp(app: INestApplication) {
  const config = app.get(ConfigService);

  // Deshabilitar cabecera X-Powered-By
  const server = app.getHttpAdapter().getInstance();
  if (server && typeof server.disable === 'function') {
    server.disable('x-powered-by');
  }

  // Limitar el tamaño de request (JSON y URL-encoded) a máximo 1MB
  const express = require('express');
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}
