import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TransaccionesService } from './transacciones.service';

class DepositDto {
  @IsString()
  accountId: string;

  @IsNumber()
  @Min(0.01)
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

  @IsNumber()
  @Min(0.01)
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
  findAll(@Query('accountId') accountId?: string) {
    if (accountId) return this.transaccionesService.findByAccountId(accountId);
    return this.transaccionesService.findAll();
  }

  @Get('transacciones/:id')
  findById(@Param('id') id: string) {
    return this.transaccionesService.findById(id);
  }

  @Post('transacciones/depositos')
  deposit(@Body() dto: DepositDto) {
    return this.transaccionesService.deposit(dto);
  }

  @Post('transacciones/retiros')
  withdraw(@Body() dto: WithdrawDto) {
    return this.transaccionesService.withdraw(dto);
  }

  @Post('transacciones/transferencias')
  transfer(@Body() dto: TransferDto) {
    return this.transaccionesService.transfer(dto);
  }
}
