import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AccountEntity, AuditLogEntity, SystemConfigEntity, TransactionEntity, UserEntity } from '../../../libs/common/src/entities';
import { generateId, generateRefCode, toNumber } from '../../../libs/common/src/utils';

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

  private async getExecutor(executorId: string) {
    const executor = await this.users.findOneBy({ id: executorId });
    if (!executor) throw new UnauthorizedException('Usuario ejecutor no encontrado.');
    if (executor.status !== 'ACTIVE') throw new UnauthorizedException('Usuario suspendido.');
    return executor;
  }
}
