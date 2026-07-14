import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UserRole } from '../../../libs/common/src/entities';
import { ClientesService } from './clientes.service';

class LoginDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  identityId: string;

  @IsEmail()
  email: string;

  @IsIn(['CLIENTE', 'CAJERO', 'AUDITOR', 'ADMIN'])
  role: UserRole;

  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsString()
  adminId?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

class EmployeeStatusDto {
  @IsIn(['ACTIVATE', 'SUSPEND'])
  action: 'ACTIVATE' | 'SUSPEND';

  @IsString()
  adminId: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

class ConfigDto {
  @IsNumber()
  @Min(10)
  dailyTransferLimit: number;

  @IsNumber()
  @Min(0)
  commissionFee: number;

  @IsNumber()
  @Min(0)
  savingsInterestRate: number;

  @IsString()
  adminId: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}

@Controller()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get('health')
  health() {
    return { service: 'clientes', status: 'ok' };
  }

  @Get('clientes')
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('clientes/:id')
  findById(@Param('id') id: string) {
    return this.clientesService.findById(id);
  }

  @Post('clientes')
  create(@Body() dto: CreateUserDto) {
    return this.clientesService.create(dto);
  }

  @Post('clientes/login')
  login(@Body() dto: LoginDto) {
    return this.clientesService.login(dto);
  }

  @Patch('clientes/:id/status')
  updateEmployeeStatus(@Param('id') id: string, @Body() dto: EmployeeStatusDto) {
    return this.clientesService.updateEmployeeStatus(id, dto);
  }

  @Get('auditoria')
  findAuditLogs() {
    return this.clientesService.findAuditLogs();
  }

  @Get('configuracion')
  getConfig() {
    return this.clientesService.getConfig();
  }

  @Patch('configuracion')
  updateConfig(@Body() dto: ConfigDto) {
    return this.clientesService.updateConfig(dto);
  }
}
