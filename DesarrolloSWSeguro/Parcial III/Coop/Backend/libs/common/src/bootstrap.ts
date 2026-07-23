import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import helmet from 'helmet';

export function configureHttpApp(app: INestApplication) {
  // Logger HTTP integrado para todos los microservicios y Gateway
  const { Logger } = require('@nestjs/common');
  app.use((req: any, res: any, next: any) => {
    const { ip, method, url } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const logger = new Logger('HTTP');
      logger.log(`${method} ${url} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent}`);
    });
    next();
  });

  const config = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  const server = app.getHttpAdapter().getInstance();
  if (server && typeof server.disable === 'function') {
    server.disable('x-powered-by');
  }

  // Hardening
  app.use(helmet());

  // Limitar el tamaño de request (JSON y URL-encoded) a máximo 1MB
  const express = require('express');
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  app.enableCors({
    origin: '*',
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
