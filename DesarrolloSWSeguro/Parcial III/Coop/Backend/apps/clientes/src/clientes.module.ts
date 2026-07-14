import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from '../../../libs/common/src/database/typeorm.config';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity } from '../../../libs/common/src/entities';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([UserEntity, AccountEntity, TransactionEntity, AuditLogEntity, SystemConfigEntity]),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
