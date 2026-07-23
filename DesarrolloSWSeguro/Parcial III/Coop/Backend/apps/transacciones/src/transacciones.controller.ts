import { Body, Controller, Get, Param, Post, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TransaccionesService } from './transacciones.service';
import { TransformStrictMonetary } from '../../../libs/common/src/utils';

class DepositDto {
  @IsString()
  accountId: string;

  @TransformStrictMonetary()
  @IsNumber({}, { message: 'El monto debe ser un número positivo válido con un máximo de 2 decimales y sin caracteres especiales (+, -, *, /, letras).' })
  @Min(0.01, { message: 'El monto mínimo permitido es 0.01.' })
  amount: number;

  @IsString()
  description: string;

  @IsString()
  executorId: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

class WithdrawDto extends DepositDto {
  @IsIn(['ATM', 'VENTANILLA'])
  channel: 'ATM' | 'VENTANILLA';
}

class TransferDto {
  @IsString()
  sourceAccountId: string;

  @IsString()
  destinationAccountNumber: string;

  @TransformStrictMonetary()
  @IsNumber({}, { message: 'El monto debe ser un número positivo válido con un máximo de 2 decimales y sin caracteres especiales (+, -, *, /, letras).' })
  @Min(0.01, { message: 'El monto mínimo permitido es 0.01.' })
  amount: number;

  @IsString()
  description: string;

  @IsString()
  executorId: string;

  @IsBoolean()
  isExternal: boolean;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

@Controller()
export class TransaccionesController {
  constructor(private readonly transaccionesService: TransaccionesService) {}

  @Get('health')
  health() {
    return { service: 'transacciones', status: 'ok' };
  }

  @Get('transacciones')
  async findAll(
    @Query('accountId') accountId?: string,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-role') role?: string,
  ) {
    if (role === 'CLIENTE') {
      if (!accountId) {
        throw new UnauthorizedException('No autorizado: Debe especificar accountId.');
      }
      const isOwner = await this.transaccionesService.verifyAccountOwner(accountId, userId || '');
      if (!isOwner) {
        throw new UnauthorizedException('No autorizado: Esta cuenta no le pertenece.');
      }
      return this.transaccionesService.findByAccountId(accountId);
    }

    if (!['CAJERO', 'AUDITOR', 'ADMIN'].includes(role || '')) {
      throw new UnauthorizedException('No autorizado.');
    }

    if (accountId) return this.transaccionesService.findByAccountId(accountId);
    return this.transaccionesService.findAll();
  }

  @Get('transacciones/:id')
  async findById(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (role === 'CLIENTE') {
      const isOwner = await this.transaccionesService.verifyTransactionOwner(id, userId);
      if (!isOwner) {
        throw new UnauthorizedException('No autorizado: Acceso denegado a esta transaccion.');
      }
    } else if (!['CAJERO', 'AUDITOR', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado.');
    }
    return this.transaccionesService.findById(id);
  }

  @Post('transacciones/depositos')
  deposit(
    @Body() dto: DepositDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (dto.executorId !== userId) {
      throw new UnauthorizedException('No autorizado: El ejecutor debe ser el usuario autenticado.');
    }
    if (role !== 'CAJERO' && role !== 'CLIENTE') {
      throw new UnauthorizedException('No autorizado: Rol invalido para realizar depositos.');
    }
    return this.transaccionesService.deposit(dto);
  }

  @Post('transacciones/retiros')
  withdraw(
    @Body() dto: WithdrawDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (dto.executorId !== userId) {
      throw new UnauthorizedException('No autorizado: El ejecutor debe ser el usuario autenticado.');
    }
    if (role !== 'CAJERO' && role !== 'CLIENTE') {
      throw new UnauthorizedException('No autorizado: Rol invalido para realizar retiros.');
    }
    return this.transaccionesService.withdraw(dto);
  }

  @Post('transacciones/transferencias')
  transfer(
    @Body() dto: TransferDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (dto.executorId !== userId) {
      throw new UnauthorizedException('No autorizado: El ejecutor debe ser el usuario autenticado.');
    }
    if (role !== 'CLIENTE' && role !== 'CAJERO') {
      throw new UnauthorizedException('No autorizado: Rol invalido para realizar transferencias.');
    }
    return this.transaccionesService.transfer(dto);
  }
}
