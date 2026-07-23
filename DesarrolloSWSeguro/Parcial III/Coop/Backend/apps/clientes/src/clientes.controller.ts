import { Body, Controller, Get, Param, Patch, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { UserRole } from '../../../libs/common/src/entities';
import { ClientesService } from './clientes.service';

class RefreshDto {
  @IsString()
  refreshToken: string;
}

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
  findAll(@Headers('x-user-role') role: string) {
    if (!['CAJERO', 'AUDITOR', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado: Rol insuficiente.');
    }
    return this.clientesService.findAll();
  }

  @Get('clientes/:id')
  findById(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (userId !== id && !['CAJERO', 'AUDITOR', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado: Acceso denegado.');
    }
    return this.clientesService.findById(id);
  }

  @Post('clientes')
  create(
    @Body() dto: CreateUserDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (dto.role !== 'CLIENTE') {
      if (role !== 'ADMIN' || dto.adminId !== userId) {
        throw new UnauthorizedException('No autorizado: Solo el administrador puede crear empleados.');
      }
    }
    return this.clientesService.create(dto);
  }

  @Post('clientes/login')
  login(@Body() dto: LoginDto) {
    return this.clientesService.login(dto);
  }

  @Post('clientes/refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.clientesService.refresh(dto.refreshToken);
  }

  @Post('clientes/logout')
  logout(@Headers('x-user-id') userId: string) {
    if (!userId) throw new UnauthorizedException('No autorizado.');
    return this.clientesService.logout(userId);
  }

  @Patch('clientes/:id/status')
  updateEmployeeStatus(
    @Param('id') id: string,
    @Body() dto: EmployeeStatusDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (role !== 'ADMIN' || dto.adminId !== userId) {
      throw new UnauthorizedException('No autorizado: Solo el administrador puede gestionar empleados.');
    }
    return this.clientesService.updateEmployeeStatus(id, dto);
  }

  @Get('auditoria')
  findAuditLogs(@Headers('x-user-role') role: string) {
    if (!['AUDITOR', 'ADMIN'].includes(role)) {
      throw new UnauthorizedException('No autorizado: Rol insuficiente.');
    }
    return this.clientesService.findAuditLogs();
  }

  @Get('configuracion')
  getConfig() {
    return this.clientesService.getConfig();
  }

  @Patch('configuracion')
  updateConfig(
    @Body() dto: ConfigDto,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    if (role !== 'ADMIN' || dto.adminId !== userId) {
      throw new UnauthorizedException('No autorizado: Solo el administrador puede cambiar configuración.');
    }
    return this.clientesService.updateConfig(dto);
  }
}
