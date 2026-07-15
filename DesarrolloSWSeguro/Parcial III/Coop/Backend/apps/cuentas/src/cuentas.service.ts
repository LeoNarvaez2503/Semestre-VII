import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity, AccountType, AuditLogEntity, UserEntity } from '../../../libs/common/src/entities';
import { generateId } from '../../../libs/common/src/utils';

@Injectable()
export class CuentasService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accounts: Repository<AccountEntity>,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogs: Repository<AuditLogEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.accounts.count();
    if (count > 0) return;

    await this.accounts.save([
      { id: 'acc-savings-anthony', userId: 'client-anthony', accountNumber: '100234567', type: 'AHORROS', balance: 12450.5, status: 'ACTIVE' },
      { id: 'acc-checking-anthony', userId: 'client-anthony', accountNumber: '200456789', type: 'CORRIENTE', balance: 1500, status: 'ACTIVE' },
      { id: 'acc-savings-segundo', userId: 'client-segundo', accountNumber: '100555666', type: 'AHORROS', balance: 850, status: 'ACTIVE' },
    ]);
  }

  findAll() {
    return this.accounts.find({ order: { createdAt: 'ASC' } });
  }

  async findById(id: string) {
    const account = await this.accounts.findOneBy({ id });
    if (!account) throw new NotFoundException('Cuenta no encontrada.');
    return account;
  }

  findByUserId(userId: string) {
    return this.accounts.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async findByAccountNumber(accountNumber: string) {
    const account = await this.accounts.findOneBy({ accountNumber });
    if (!account) throw new NotFoundException('Cuenta no encontrada.');
    return account;
  }

  async create(dto: { userId: string; accountNumber: string; type: AccountType; balance?: number }) {
    const user = await this.users.findOneBy({ id: dto.userId });
    if (!user) throw new BadRequestException('El cliente indicado no existe.');

    const duplicate = await this.accounts.findOneBy({ accountNumber: dto.accountNumber });
    if (duplicate) throw new BadRequestException('Ya existe una cuenta con ese numero.');

    return this.accounts.save(
      this.accounts.create({
        id: generateId('acc'),
        ...dto,
        balance: dto.balance ?? 0,
        status: 'ACTIVE',
      }),
    );
  }

  async freeze(id: string, dto: { action: 'FREEZE' | 'UNFREEZE'; auditorId: string; reason: string; ipAddress?: string }) {
    const auditor = await this.users.findOneBy({ id: dto.auditorId });
    if (!auditor || auditor.role !== 'AUDITOR') {
      throw new UnauthorizedException('Solo el auditor puede congelar o descongelar cuentas.');
    }

    const account = await this.findById(id);
    if (dto.action === 'FREEZE' && account.status === 'FROZEN') throw new BadRequestException('La cuenta ya esta congelada.');
    if (dto.action === 'UNFREEZE' && account.status !== 'FROZEN') throw new BadRequestException('La cuenta no esta congelada.');

    account.status = dto.action === 'FREEZE' ? 'FROZEN' : 'ACTIVE';
    const saved = await this.accounts.save(account);

    const client = await this.users.findOneBy({ id: account.userId });
    await this.auditLogs.save({
      id: generateId('audit'),
      userId: auditor.id,
      userName: auditor.name,
      role: auditor.role,
      action: dto.action === 'FREEZE' ? 'CONGELAMIENTO_CUENTA' : 'DESCONGELAMIENTO_CUENTA',
      details: `${dto.action === 'FREEZE' ? 'Congelamiento' : 'Descongelamiento'} de cuenta #${account.accountNumber} de ${client?.name ?? 'Cliente'}. Razon: ${dto.reason}`,
      ipAddress: dto.ipAddress ?? '0.0.0.0',
    });

    return saved;
  }
}
