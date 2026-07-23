import { Body, Controller, Get, Param, Patch, Post, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AccountType } from '../../../libs/common/src/entities';
import { CuentasService } from './cuentas.service';
import { TransformStrictMonetary } from '../../../libs/common/src/utils';

class CreateAccountDto {
  @IsString()
  userId: string;

  @IsString()
  accountNumber: string;

  @IsIn(['AHORROS', 'CORRIENTE'])
  type: AccountType;

  @IsOptional()
  @TransformStrictMonetary()
  @IsNumber({}, { message: 'El balance inicial debe ser un número positivo válido con un máximo de 2 decimales y sin caracteres especiales (+, -, *, /, letras).' })
  @Min(0, { message: 'El balance inicial mínimo permitido es 0.' })
  balance?: number;
}

class FreezeAccountDto {
  @IsIn(['FREEZE', 'UNFREEZE'])
  action: 'FREEZE' | 'UNFREEZE';

  @IsString()
  auditorId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

@Controller()
export class CuentasController {
  constructor(private readonly cuentasService: CuentasService) {}

  @Get('health')
  health() {
    return { service: 'cuentas', status: 'ok' };
  }

  @Get('cuentas')
  findAll(
    @Query('userId') queryUserId?: string,
    @Query('accountNumber') accountNumber?: string,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-role') role?: string,
  ) {
    if (role === 'CLIENTE') {
      if (queryUserId && queryUserId === userId) {
        return this.cuentasService.findByUserId(queryUserId);
      }
      throw new UnauthorizedException('No autorizado: Acceso denegado.');
    }

    if (!['CAJERO', 'AUDITOR', 'ADMIN'].includes(role || '')) {
      throw new UnauthorizedException('No autorizado.');
    }

    if (queryUserId) return this.cuentasService.findByUserId(queryUserId);
    if (accountNumber) return this.cuentasService.findByAccountNumber(accountNumber);
    return this.cuentasService.findAll();
  }

  @Get('cuentas/:id')
  async findById(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    const account = await this.cuentasService.findById(id);
    if (account.userId !== userId && !['CAJERO', 'AUDITOR', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado: Acceso denegado.');
    }
    return account;
  }

  @Post('cuentas')
  create(
    @Body() dto: CreateAccountDto,
    @Headers('x-user-role') role: string,
  ) {
    if (!['CAJERO', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado: Solo cajeros o administradores pueden crear cuentas.');
    }
    return this.cuentasService.create(dto);
  }

  @Patch('cuentas/:id/freeze')
  freeze(
    @Param('id') id: string,
    @Body() dto: FreezeAccountDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (role !== 'AUDITOR' || dto.auditorId !== userId) {
      throw new UnauthorizedException('No autorizado: Solo el auditor asignado puede realizar esta acción.');
    }
    return this.cuentasService.freeze(id, dto);
  }
}
