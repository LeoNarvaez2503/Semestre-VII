import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AccountEntity,
  AuditLogEntity,
  SystemConfigEntity,
  TransactionEntity,
  UserEntity,
} from '../entities';

export const buildTypeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: Number(config.get<string>('DB_PORT', '5432')),
  username: config.get<string>('DB_USERNAME', 'postgres'),
  password: config.get<string>('DB_PASSWORD', 'postgres'),
  database: config.get<string>('DB_DATABASE', 'mushuc_runa'),
  entities: [UserEntity, AccountEntity, TransactionEntity, AuditLogEntity, SystemConfigEntity],
  synchronize: config.get<string>('DB_SYNCHRONIZE', 'false') === 'true',
  logging: config.get<string>('DB_LOGGING', 'false') === 'true',
  ssl:
    config.get<string>('DB_SSL', 'false') === 'true'
      ? { rejectUnauthorized: config.get<string>('DB_SSL_REJECT_UNAUTHORIZED', 'false') === 'true' }
      : false,
});
