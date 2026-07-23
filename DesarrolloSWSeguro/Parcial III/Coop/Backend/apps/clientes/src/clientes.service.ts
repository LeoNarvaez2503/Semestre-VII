import { BadRequestException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity, UserRole } from '../../../libs/common/src/entities';
import { DEMO_PASSWORD, generateId, hashPassword, verifyPassword, signJwt, verifyJwt, getRedisClient } from '../../../libs/common/src/utils';

@Injectable()
export class ClientesService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private readonly accounts: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity)
    private readonly transactions: Repository<TransactionEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogs: Repository<AuditLogEntity>,
    @InjectRepository(SystemConfigEntity)
    private readonly config: Repository<SystemConfigEntity>,
  ) {}

  async onModuleInit() {
    if (this.configService.get<string>('DB_SEED_DEMO', 'false') !== 'true') return;

    const usersCount = await this.users.count();
    if (usersCount === 0) {
      await this.users.save([
        { id: 'client-anthony', name: 'Anthony Alain Morales', identityId: '1804294812', email: 'AnthonyAlainMorales@gmail.com', role: 'CLIENTE', status: 'ACTIVE', twoFactorEnabled: true, passwordHash: hashPassword('Demo2026!') },
        { id: 'client-segundo', name: 'Segundo Intriago Chango', identityId: '1805556661', email: 'segundo.chango@mushucruna.ec', role: 'CLIENTE', status: 'ACTIVE', twoFactorEnabled: false, passwordHash: hashPassword('Demo2026!') },
        { id: 'cashier-maria', name: 'Maria Juana Pilamunga', identityId: '1802345678', email: 'maria.juana@mushucruna.ec', role: 'CAJERO', status: 'ACTIVE', twoFactorEnabled: true, passwordHash: hashPassword('Demo2026!') },
        { id: 'auditor-humberto', name: 'Humberto Calero Flores', identityId: '1803456789', email: 'humberto.calero@mushucruna.ec', role: 'AUDITOR', status: 'ACTIVE', twoFactorEnabled: true, passwordHash: hashPassword('Demo2026!') },
        { id: 'admin-luis', name: 'Abg. Luis Alfonso Chango', identityId: '1801234567', email: 'luis.chango@mushucruna.ec', role: 'ADMIN', status: 'ACTIVE', twoFactorEnabled: true, passwordHash: hashPassword('Demo2026!') },
      ]);
    }

    const accountsCount = await this.accounts.count();
    if (accountsCount === 0) {
      await this.accounts.save([
        { id: 'acc-savings-anthony', userId: 'client-anthony', accountNumber: '100234567', type: 'AHORROS', balance: 12450.5, status: 'ACTIVE' },
        { id: 'acc-checking-anthony', userId: 'client-anthony', accountNumber: '200456789', type: 'CORRIENTE', balance: 1500, status: 'ACTIVE' },
        { id: 'acc-savings-segundo', userId: 'client-segundo', accountNumber: '100555666', type: 'AHORROS', balance: 850, status: 'ACTIVE' },
      ]);
    }

    const txsCount = await this.transactions.count();
    if (txsCount === 0) {
      await this.transactions.save([
        { id: 'tx-init-1', sourceAccountId: null, destinationAccountId: 'acc-savings-anthony', type: 'DEPOSIT', amount: 12500.5, description: 'Deposito Inicial de Apertura en Efectivo', ipAddress: '192.168.1.100', status: 'SUCCESS', fee: 0, refCode: 'DEP-773821' },
        { id: 'tx-init-2', sourceAccountId: 'acc-savings-anthony', destinationAccountId: 'acc-savings-segundo', type: 'TRANSFER', amount: 50, description: 'Transferencia por Servicios Ambientales', ipAddress: '192.168.1.102', status: 'SUCCESS', fee: 0, refCode: 'TRF-552194' },
        { id: 'tx-init-3', sourceAccountId: null, destinationAccountId: 'acc-savings-segundo', type: 'DEPOSIT', amount: 800, description: 'Deposito de Apertura en Efectivo', ipAddress: '192.168.1.101', status: 'SUCCESS', fee: 0, refCode: 'DEP-883921' },
        { id: 'tx-init-4', sourceAccountId: null, destinationAccountId: 'acc-checking-anthony', type: 'DEPOSIT', amount: 1500, description: 'Deposito de Apertura en Efectivo', ipAddress: '192.168.1.100', status: 'SUCCESS', fee: 0, refCode: 'DEP-994021' },
      ]);
    }

    const auditCount = await this.auditLogs.count();
    if (auditCount === 0) {
      await this.auditLogs.save({
        id: 'audit-init-1',
        userId: 'admin-luis',
        userName: 'Abg. Luis Alfonso Chango',
        role: 'ADMIN',
        action: 'SYSTEM_BOOTSTRAP',
        details: 'Inicializacion de la plataforma financiera Mushuc Runa.',
        ipAddress: '10.0.1.1',
      });
    }

    const configCount = await this.config.count();
    if (configCount === 0) {
      await this.config.save({ id: 'default', dailyTransferLimit: 5000, commissionFee: 2.5, savingsInterestRate: 6.5 });
    }
  }

  findAll() {
    return this.users.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string) {
    const user = await this.users.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado.');
    return user;
  }

  async create(dto: { name: string; identityId: string; email: string; role: UserRole; twoFactorEnabled?: boolean; adminId?: string; ipAddress?: string }) {
    if (dto.role !== 'CLIENTE') {
      if (!dto.adminId) throw new UnauthorizedException('Se requiere adminId para crear empleados.');
      const admin = await this.findById(dto.adminId);
      if (admin.role !== 'ADMIN') throw new UnauthorizedException('Solo el administrador puede crear empleados.');
    }

    const allUsers = await this.users.find();
    const duplicate = allUsers.find(
      u => u.identityId === dto.identityId || u.email.toLowerCase() === dto.email.toLowerCase()
    );
    if (duplicate) throw new BadRequestException('Ya existe un usuario con esa identificacion o correo.');

    const saved = await this.users.save(
      this.users.create({
        id: generateId(dto.role === 'CLIENTE' ? 'client' : 'emp'),
        name: dto.name,
        identityId: dto.identityId,
        email: dto.email,
        role: dto.role,
        status: 'ACTIVE',
        twoFactorEnabled: dto.twoFactorEnabled ?? false,
        passwordHash: hashPassword('Demo2026!'),
      }),
    );

    if (dto.adminId && dto.role !== 'CLIENTE') {
      const admin = await this.findById(dto.adminId);
      await this.auditLogs.save({
        id: generateId('audit'),
        userId: admin.id,
        userName: admin.name,
        role: admin.role,
        action: 'EMPLOYEE_CREATED',
        details: `Creacion de empleado ${saved.name} con rol ${saved.role}.`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
      });
    }

    return saved;
  }

  async login(dto: { identifier: string; password: string; ipAddress?: string }) {
    const identifier = dto.identifier.trim().toLowerCase();
    const allUsers = await this.users.find();
    const user = allUsers.find(
      u => u.email.toLowerCase() === identifier || u.identityId === dto.identifier.trim()
    );

    if (!user || !verifyPassword(dto.password, user.passwordHash || '')) {
      await this.auditLogs.save({
        id: generateId('audit'),
        userId: 'anonymous',
        userName: dto.identifier || 'Usuario desconocido',
        role: 'CLIENTE',
        action: 'LOGIN_FAILED',
        details: `Intento de inicio de sesion rechazado para ${dto.identifier || 'credencial vacia'}.`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
      });
      throw new UnauthorizedException('Credenciales invalidas.');
    }

    if (user.status !== 'ACTIVE') throw new UnauthorizedException('Usuario suspendido.');

    await this.auditLogs.save({
      id: generateId('audit'),
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'LOGIN_SUCCESS',
      details: `Inicio de sesion exitoso para rol ${user.role}.`,
      ipAddress: dto.ipAddress ?? '0.0.0.0',
    });

    const secret = process.env.ENCRYPTION_KEY || 'my-super-secret-key-32-chars-!!!';
    const accessToken = signJwt({ userId: user.id, role: user.role }, secret, 900);
    const refreshToken = signJwt({ userId: user.id, role: user.role }, secret, 604800);

    const redis = getRedisClient();
    await redis.set(`auth:access:${user.id}`, accessToken, 'EX', 900);
    await redis.set(`auth:refresh:${user.id}`, refreshToken, 'EX', 604800);

    return {
      id: user.id,
      name: user.name,
      identityId: user.identityId,
      email: user.email,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      accessToken,
      refreshToken,
    };
  }

  async updateEmployeeStatus(id: string, dto: { action: 'ACTIVATE' | 'SUSPEND'; adminId: string; ipAddress?: string }) {
    const admin = await this.findById(dto.adminId);
    if (admin.role !== 'ADMIN') throw new UnauthorizedException('Solo el administrador puede gestionar empleados.');

    const employee = await this.findById(id);
    if (employee.role === 'ADMIN') throw new BadRequestException('No es posible modificar otro administrador.');
    employee.status = dto.action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
    const saved = await this.users.save(employee);

    await this.auditLogs.save({
      id: generateId('audit'),
      userId: admin.id,
      userName: admin.name,
      role: admin.role,
      action: dto.action === 'ACTIVATE' ? 'EMPLOYEE_ACTIVATED' : 'EMPLOYEE_SUSPENDED',
      details: `${dto.action === 'ACTIVATE' ? 'Activacion' : 'Suspension'} del empleado ${employee.name}.`,
      ipAddress: dto.ipAddress ?? '0.0.0.0',
    });

    return saved;
  }

  findAuditLogs() {
    return this.auditLogs.find({ order: { timestamp: 'DESC' } });
  }

  async getConfig() {
    const current = await this.config.findOneBy({ id: 'default' });
    if (current) return current;
    return this.config.save({ id: 'default', dailyTransferLimit: 5000, commissionFee: 2.5, savingsInterestRate: 6.5 });
  }

  async updateConfig(dto: {
    dailyTransferLimit: number;
    commissionFee: number;
    savingsInterestRate: number;
    adminId: string;
    ipAddress?: string;
  }) {
    const admin = await this.findById(dto.adminId);
    if (admin.role !== 'ADMIN') throw new UnauthorizedException('Solo el administrador puede cambiar configuracion.');

    const saved = await this.config.save({
      id: 'default',
      dailyTransferLimit: dto.dailyTransferLimit,
      commissionFee: dto.commissionFee,
      savingsInterestRate: dto.savingsInterestRate,
    });

    await this.auditLogs.save({
      id: generateId('audit'),
      userId: admin.id,
      userName: admin.name,
      role: admin.role,
      action: 'SYSTEM_CONFIG_UPDATED',
      details: `Actualizacion de parametros del sistema. Limite diario: ${dto.dailyTransferLimit}, comision: ${dto.commissionFee}, interes: ${dto.savingsInterestRate}.`,
      ipAddress: dto.ipAddress ?? '0.0.0.0',
    });

    return saved;
  }

  async refresh(token: string) {
    const secret = process.env.ENCRYPTION_KEY || 'my-super-secret-key-32-chars-!!!';
    const payload = verifyJwt(token, secret);
    if (!payload || !payload.userId) {
      throw new UnauthorizedException('Token de refresco invalido o expirado.');
    }

    const redis = getRedisClient();
    const activeRefreshToken = await redis.get(`auth:refresh:${payload.userId}`);
    if (activeRefreshToken !== token) {
      throw new UnauthorizedException('Sesion de refresco inactiva o cerrada.');
    }

    const accessToken = signJwt({ userId: payload.userId, role: payload.role }, secret, 900);
    const newRefreshToken = signJwt({ userId: payload.userId, role: payload.role }, secret, 604800);

    await redis.set(`auth:access:${payload.userId}`, accessToken, 'EX', 900);
    await redis.set(`auth:refresh:${payload.userId}`, newRefreshToken, 'EX', 604800);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const redis = getRedisClient();
    await redis.del(`auth:access:${userId}`);
    await redis.del(`auth:refresh:${userId}`);
    return { success: true };
  }
}
