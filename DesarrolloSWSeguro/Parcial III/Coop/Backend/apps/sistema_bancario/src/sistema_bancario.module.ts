import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuditMiddleware } from '../../../libs/common/src/middlewares/audit.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SistemaBancarioController } from './sistema_bancario.controller';
import { SistemaBancarioService } from './sistema_bancario.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'CLIENTES_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('SVC_CLIENTES_HOST', 'localhost'),
            port: config.get('SVC_CLIENTES_PORT', 4001),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CUENTAS_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('SVC_CUENTAS_HOST', 'localhost'),
            port: config.get('SVC_CUENTAS_PORT', 4002),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TRANSACCIONES_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get('SVC_TRANSACCIONES_HOST', 'localhost'),
            port: config.get('SVC_TRANSACCIONES_PORT', 4003),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'EVENTS_SERVICE',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get('REDIS_PORT', 6379),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SistemaBancarioController],
  providers: [SistemaBancarioService],
})
export class SistemaBancarioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes('*');
  }
}
