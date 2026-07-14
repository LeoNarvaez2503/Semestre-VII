import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from '../../../libs/common/src/database/typeorm.config';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity } from '../../../libs/common/src/entities';
import { TransaccionesController } from './transacciones.controller';
import { TransaccionesService } from './transacciones.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([TransactionEntity, AccountEntity, UserEntity, AuditLogEntity, SystemConfigEntity]),
  ],
  controllers: [TransaccionesController],
  providers: [TransaccionesService],
})
export class TransaccionesModule {}
