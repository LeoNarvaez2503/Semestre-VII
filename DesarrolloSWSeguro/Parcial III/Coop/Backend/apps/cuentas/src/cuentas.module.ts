import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from '../../../libs/common/src/database/typeorm.config';
import { AccountEntity, AuditLogEntity, UserEntity } from '../../../libs/common/src/entities';
import { CuentasController } from './cuentas.controller';
import { CuentasService } from './cuentas.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([AccountEntity, UserEntity, AuditLogEntity]),
  ],
  controllers: [CuentasController],
  providers: [CuentasService],
})
export class CuentasModule {}
