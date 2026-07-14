import { BadRequestException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity, UserRole } from '../../../libs/common/src/entities';
import { DEMO_PASSWORD, generateId } from '../../../libs/common/src/utils';

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
    if (usersCount > 0) return;

    await this.users.save([
      { id: 'client-anthony', name: 'Anthony Alain Morales', identityId: '1804294812', email: 'AnthonyAlainMorales@gmail.com', role: 'CLIENTE', status: 'ACTIVE', twoFactorEnabled: true },
      { id: 'client-segundo', name: 'Segundo Intriago Chango', identityId: '1805556661', email: 'segundo.chango@mushucruna.ec', role: 'CLIENTE', status: 'ACTIVE', twoFactorEnabled: false },
      { id: 'cashier-maria', name: 'Maria Juana Pilamunga', identityId: '1802345678', email: 'maria.juana@mushucruna.ec', role: 'CAJERO', status: 'ACTIVE', twoFactorEnabled: true },
      { id: 'auditor-humberto', name: 'Humberto Calero Flores', identityId: '1803456789', email: 'humberto.calero@mushucruna.ec', role: 'AUDITOR', status: 'ACTIVE', twoFactorEnabled: true },
      { id: 'admin-luis', name: 'Abg. Luis Alfonso Chango', identityId: '1801234567', email: 'luis.chango@mushucruna.ec', role: 'ADMIN', status: 'ACTIVE', twoFactorEnabled: true },
    ]);

    await this.accounts.save([
      { id: 'acc-savings-anthony', userId: 'client-anthony', accountNumber: '100234567', type: 'AHORROS', balance: 12450.5, status: 'ACTIVE' },
      { id: 'acc-checking-anthony', userId: 'client-anthony', accountNumber: '200456789', type: 'CORRIENTE', balance: 1500, status: 'ACTIVE' },
      { id: 'acc-savings-segundo', userId: 'client-segundo', accountNumber: '100555666', type: 'AHORROS', balance: 850, status: 'ACTIVE' },
    ]);

    await this.transactions.save([
      { id: 'tx-init-1', sourceAccountId: null, destinationAccountId: 'acc-savings-anthony', type: 'DEPOSIT', amount: 10000, description: 'Deposito Inicial de Apertura en Efectivo', ipAddress: '192.168.1.100', status: 'SUCCESS', fee: 0, refCode: 'DEP-773821' },
      { id: 'tx-init-2', sourceAccountId: 'acc-savings-anthony', destinationAccountId: 'acc-savings-segundo', type: 'TRANSFER', amount: 50, description: 'Transferencia por Servicios Ambientales', ipAddress: '192.168.1.102', status: 'SUCCESS', fee: 0, refCode: 'TRF-552194' },
    ]);

    await this.auditLogs.save({
      id: 'audit-init-1',
      userId: 'admin-luis',
      userName: 'Abg. Luis Alfonso Chango',
      role: 'ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Inicializacion de la plataforma financiera Mushuc Runa.',
      ipAddress: '10.0.1.1',
    });

    await this.config.save({ id: 'default', dailyTransferLimit: 5000, commissionFee: 2.5, savingsInterestRate: 6.5 });
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

    const duplicate = await this.users.findOne({
      where: [{ identityId: dto.identityId }, { email: dto.email }],
    });
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
    const user = await this.users
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :identifier', { identifier })
      .orWhere('user.identityId = :identityId', { identityId: dto.identifier.trim() })
      .getOne();

    if (!user || dto.password !== DEMO_PASSWORD) {
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

    return user;
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
}
