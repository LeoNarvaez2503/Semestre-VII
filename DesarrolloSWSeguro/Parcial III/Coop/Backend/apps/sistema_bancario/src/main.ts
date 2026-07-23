import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SistemaBancarioModule } from './sistema_bancario.module';
import helmet from 'helmet';
import * as express from 'express';
import { AllExceptionsFilter } from '../../../libs/common/src/filters/all-exceptions.filter';
import { Logger } from '@nestjs/common';
import { getRedisClient, verifyJwt } from '../../../libs/common/src/utils';

async function bootstrap() {
  const app = await NestFactory.create(SistemaBancarioModule, { bodyParser: false });

  // Global Exception Filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // Hardening
  app.use(helmet());

  // CORS middleware for Proxy
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Middleware de Autenticación JWT y validación contra Redis
  const redis = getRedisClient();

  app.use(async (req: any, res: any, next: any) => {
    const publicPaths = [
      '/api/clientes/clientes/login',
      '/api/clientes/clientes/refresh',
      '/health',
      '/api/clientes/health',
      '/api/cuentas/health',
      '/api/transacciones/health',
    ];

    // Omitir validación en rutas públicas y métodos OPTIONS
    if (req.method === 'OPTIONS' || publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        error: 'No autorizado: Token no proporcionado o formato inválido.',
      });
    }

    const token = authHeader.substring(7);
    const secret = process.env.ENCRYPTION_KEY || 'my-super-secret-key-32-chars-!!!';
    const payload = verifyJwt(token, secret);

    if (!payload || !payload.userId) {
      return res.status(401).json({
        statusCode: 401,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        error: 'No autorizado: Token inválido o expirado.',
      });
    }

    try {
      const activeToken = await redis.get(`auth:access:${payload.userId}`);
      if (activeToken !== token) {
        return res.status(401).json({
          statusCode: 401,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          error: 'No autorizado: Sesión inactiva o cerrada.',
        });
      }
    } catch (err) {
      return res.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        error: 'Error interno de autenticación de sesión.',
      });
    }

    // Inyectar contexto de usuario en las cabeceras para consumo de microservicios
    req.headers['x-user-id'] = payload.userId;
    req.headers['x-user-role'] = payload.role;
    next();
  });

  // Proxy Routes
  const { createProxyMiddleware } = require('http-proxy-middleware');

  const proxyOptions = (host: string | undefined, port: string | number, pathRewrite: any) => ({
    target: `http://${host || 'localhost'}:${port}`,
    changeOrigin: true,
    pathRewrite,
  });

  app.use('/api/clientes', createProxyMiddleware(proxyOptions(process.env.SVC_CLIENTES_HOST, process.env.SVC_CLIENTES_HTTP_PORT || 5001, { '^/api/clientes': '' })));
  app.use('/api/cuentas', createProxyMiddleware(proxyOptions(process.env.SVC_CUENTAS_HOST, process.env.SVC_CUENTAS_HTTP_PORT || 5002, { '^/api/cuentas': '' })));
  app.use('/api/transacciones', createProxyMiddleware(proxyOptions(process.env.SVC_TRANSACCIONES_HOST, process.env.SVC_TRANSACCIONES_HTTP_PORT || 5003, { '^/api/transacciones': '' })));

  const port = process.env.port ?? 3000;
  await app.listen(port);
  Logger.log(`API Gateway is running on: http://localhost:${port}`);
}
bootstrap();
