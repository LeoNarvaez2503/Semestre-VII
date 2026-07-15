import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SistemaBancarioModule } from './sistema_bancario.module';
import helmet from 'helmet';
import * as express from 'express';
import { AllExceptionsFilter } from '../../../libs/common/src/filters/all-exceptions.filter';
import { Logger } from '@nestjs/common';

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
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
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
