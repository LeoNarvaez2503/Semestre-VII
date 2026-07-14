import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { AccountType } from '../../../libs/common/src/entities';
import { CuentasService } from './cuentas.service';

class CreateAccountDto {
  @IsString()
  userId: string;

  @IsString()
  accountNumber: string;

  @IsIn(['AHORROS', 'CORRIENTE'])
  type: AccountType;

  @IsOptional()
  @IsNumber()
  @Min(0)
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
  findAll(@Query('userId') userId?: string, @Query('accountNumber') accountNumber?: string) {
    if (userId) return this.cuentasService.findByUserId(userId);
    if (accountNumber) return this.cuentasService.findByAccountNumber(accountNumber);
    return this.cuentasService.findAll();
  }

  @Get('cuentas/:id')
  findById(@Param('id') id: string) {
    return this.cuentasService.findById(id);
  }

  @Post('cuentas')
  create(@Body() dto: CreateAccountDto) {
    return this.cuentasService.create(dto);
  }

  @Patch('cuentas/:id/freeze')
  freeze(@Param('id') id: string, @Body() dto: FreezeAccountDto) {
    return this.cuentasService.freeze(id, dto);
  }
}
