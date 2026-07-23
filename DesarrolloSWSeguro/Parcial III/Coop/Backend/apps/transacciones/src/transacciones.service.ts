import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity } from '../../../libs/common/src/entities';
import { generateId, generateRefCode, toNumber, hashPassword } from '../../../libs/common/src/utils';

@Injectable()
export class TransaccionesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TransactionEntity)
    private readonly transactions: Repository<TransactionEntity>,
    @InjectRepository(AccountEntity)
    private readonly accounts: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(SystemConfigEntity)
    private readonly config: Repository<SystemConfigEntity>,
  ) {}

  async onModuleInit() {
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

    const configCount = await this.config.count();
    if (configCount === 0) {
      await this.config.save({ id: 'default', dailyTransferLimit: 5000, commissionFee: 2.5, savingsInterestRate: 6.5 });
    }
  }

  findAll() {
    return this.transactions.find({ order: { timestamp: 'DESC' } });
  }

  async findById(id: string) {
    const transaction = await this.transactions.findOneBy({ id });
    if (!transaction) throw new NotFoundException('Transaccion no encontrada.');
    return transaction;
  }

  findByAccountId(accountId: string) {
    return this.transactions
      .createQueryBuilder('transaction')
      .where('transaction.sourceAccountId = :accountId', { accountId })
      .orWhere('transaction.destinationAccountId = :accountId', { accountId })
      .orderBy('transaction.timestamp', 'DESC')
      .getMany();
  }

  async deposit(dto: { accountId: string; amount: number; description: string; executorId: string; ipAddress?: string }) {
    const executor = await this.getExecutor(dto.executorId);
    if (!['CLIENTE', 'CAJERO'].includes(executor.role)) {
      throw new UnauthorizedException('Este rol no puede registrar depositos.');
    }

    return this.dataSource.transaction(async manager => {
      const account = await manager.findOneBy(AccountEntity, { id: dto.accountId });
      if (!account) throw new NotFoundException('Cuenta destino no encontrada.');
      if (account.status !== 'ACTIVE') throw new BadRequestException('La cuenta destino no esta activa.');
      if (executor.role === 'CLIENTE' && account.userId !== executor.id) {
        throw new UnauthorizedException('El cliente solo puede depositar en sus propias cuentas.');
      }

      const previousBalance = toNumber(account.balance);
      account.balance = Number((previousBalance + dto.amount).toFixed(2));
      await manager.save(account);

      const transaction = await manager.save(TransactionEntity, {
        id: generateId('tx'),
        sourceAccountId: null,
        destinationAccountId: account.id,
        type: 'DEPOSIT',
        amount: dto.amount,
        description: dto.description,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
        status: 'SUCCESS',
        fee: 0,
        refCode: generateRefCode('DEP'),
      });

      await manager.save(AuditLogEntity, {
        id: generateId('audit'),
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'DEPOSIT_SUCCESS',
        details: `Deposito de $${dto.amount.toFixed(2)} en cuenta #${account.accountNumber}. Saldo previo: $${previousBalance.toFixed(2)}, nuevo saldo: $${account.balance.toFixed(2)}.`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
      });

      return transaction;
    });
  }

  async withdraw(dto: {
    accountId: string;
    amount: number;
    description: string;
    executorId: string;
    channel: 'ATM' | 'VENTANILLA';
    ipAddress?: string;
  }) {
    const executor = await this.getExecutor(dto.executorId);
    if (executor.role === 'CLIENTE' && dto.channel !== 'ATM') throw new UnauthorizedException('El cliente solo puede solicitar retiros ATM.');
    if (executor.role === 'CAJERO' && dto.channel !== 'VENTANILLA') throw new UnauthorizedException('El cajero solo opera retiros por ventanilla.');
    if (!['CLIENTE', 'CAJERO'].includes(executor.role)) throw new UnauthorizedException('Este rol no puede retirar fondos.');
    if (dto.channel === 'ATM' && dto.amount > 500) throw new BadRequestException('Limite de retiro ATM: $500.00.');

    return this.dataSource.transaction(async manager => {
      const account = await manager.findOneBy(AccountEntity, { id: dto.accountId });
      if (!account) throw new NotFoundException('Cuenta no encontrada.');
      if (account.status !== 'ACTIVE') throw new BadRequestException('La cuenta no esta activa.');
      if (executor.role === 'CLIENTE' && account.userId !== executor.id) {
        throw new UnauthorizedException('El cliente solo puede retirar desde sus propias cuentas.');
      }

      const balance = toNumber(account.balance);
      if (balance < dto.amount) throw new BadRequestException(`Fondos insuficientes. Saldo disponible: $${balance.toFixed(2)}.`);

      const refCode = dto.channel === 'ATM' ? generateRefCode('OTP') : generateRefCode('REC');
      account.balance = Number((balance - dto.amount).toFixed(2));
      await manager.save(account);

      const transaction = await manager.save(TransactionEntity, {
        id: generateId('tx'),
        sourceAccountId: account.id,
        destinationAccountId: null,
        type: 'WITHDRAWAL',
        amount: dto.amount,
        description: `${dto.description} (Retiro por ${dto.channel})`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
        status: 'SUCCESS',
        fee: 0,
        refCode,
      });

      await manager.save(AuditLogEntity, {
        id: generateId('audit'),
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: dto.channel === 'ATM' ? 'ATM_WITHDRAWAL_REQUESTED' : 'CASHIER_WITHDRAWAL_COMPLETED',
        details: `Retiro ${dto.channel} por $${dto.amount.toFixed(2)} en cuenta #${account.accountNumber}.`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
      });

      return { transaction, otpCode: dto.channel === 'ATM' ? refCode : undefined };
    });
  }

  async transfer(dto: {
    sourceAccountId: string;
    destinationAccountNumber: string;
    amount: number;
    description: string;
    executorId: string;
    isExternal: boolean;
    ipAddress?: string;
  }) {
    const executor = await this.getExecutor(dto.executorId);
    if (executor.role !== 'CLIENTE') throw new UnauthorizedException('Solo el cliente puede iniciar transferencias.');

    return this.dataSource.transaction(async manager => {
      const source = await manager.findOneBy(AccountEntity, { id: dto.sourceAccountId });
      if (!source) throw new NotFoundException('Cuenta origen no encontrada.');
      if (source.userId !== executor.id) throw new UnauthorizedException('No posee privilegios sobre la cuenta origen.');
      if (source.status !== 'ACTIVE') throw new BadRequestException('La cuenta origen no esta activa.');

      const destination = await manager.findOneBy(AccountEntity, { accountNumber: dto.destinationAccountNumber });
      if (!destination) throw new NotFoundException('Cuenta destino no encontrada.');
      if (destination.id === source.id) throw new BadRequestException('No puede transferir a la misma cuenta.');
      if (destination.status !== 'ACTIVE') throw new BadRequestException('La cuenta destino no esta activa.');

      const currentConfig =
        (await manager.findOneBy(SystemConfigEntity, { id: 'default' })) ??
        (await manager.save(SystemConfigEntity, { id: 'default', dailyTransferLimit: 5000, commissionFee: 2.5, savingsInterestRate: 6.5 }));

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayTransfers = await manager
        .createQueryBuilder(TransactionEntity, 'transaction')
        .where('transaction.sourceAccountId = :accountId', { accountId: source.id })
        .andWhere('transaction.type = :type', { type: 'TRANSFER' })
        .andWhere('transaction.status = :status', { status: 'SUCCESS' })
        .andWhere('transaction.timestamp >= :todayStart', { todayStart })
        .getMany();

      const transferredToday = todayTransfers.reduce((sum, tx) => sum + toNumber(tx.amount), 0);
      if (transferredToday + dto.amount > toNumber(currentConfig.dailyTransferLimit)) {
        throw new BadRequestException('Limite diario de transferencias excedido.');
      }

      const fee = dto.isExternal ? toNumber(currentConfig.commissionFee) : 0;
      const totalDeduction = Number((dto.amount + fee).toFixed(2));
      const sourceBalance = toNumber(source.balance);
      if (sourceBalance < totalDeduction) throw new BadRequestException('Fondos insuficientes para transferencia y comision.');

      source.balance = Number((sourceBalance - totalDeduction).toFixed(2));
      destination.balance = Number((toNumber(destination.balance) + dto.amount).toFixed(2));

      await manager.save(source);
      await manager.save(destination);

      const transaction = await manager.save(TransactionEntity, {
        id: generateId('tx'),
        sourceAccountId: source.id,
        destinationAccountId: destination.id,
        type: 'TRANSFER',
        amount: dto.amount,
        description: dto.description,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
        status: 'SUCCESS',
        fee,
        refCode: generateRefCode('TRF'),
      });

      await manager.save(AuditLogEntity, {
        id: generateId('audit'),
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'TRANSFER_SUCCESS',
        details: `Transferencia de cuenta #${source.accountNumber} a #${destination.accountNumber}. Monto: $${dto.amount.toFixed(2)}, comision: $${fee.toFixed(2)}.`,
        ipAddress: dto.ipAddress ?? '0.0.0.0',
      });

      return transaction;
    });
  }

  async verifyAccountOwner(accountId: string, userId: string): Promise<boolean> {
    const account = await this.accounts.findOneBy({ id: accountId });
    return account ? account.userId === userId : false;
  }

  async verifyTransactionOwner(transactionId: string, userId: string): Promise<boolean> {
    const transaction = await this.transactions.findOneBy({ id: transactionId });
    if (!transaction) return false;
    
    // Buscar si el userId es dueño de la cuenta de origen o destino
    const conditions = [];
    if (transaction.sourceAccountId) conditions.push({ id: transaction.sourceAccountId, userId });
    if (transaction.destinationAccountId) conditions.push({ id: transaction.destinationAccountId, userId });
    
    if (conditions.length === 0) return false;
    const accounts = await this.accounts.find({ where: conditions });
    return accounts.length > 0;
  }

  private async getExecutor(executorId: string) {
    const executor = await this.users.findOneBy({ id: executorId });
    if (!executor) throw new UnauthorizedException('Usuario ejecutor no encontrado.');
    if (executor.status !== 'ACTIVE') throw new UnauthorizedException('Usuario suspendido.');
    return executor;
  }
}
