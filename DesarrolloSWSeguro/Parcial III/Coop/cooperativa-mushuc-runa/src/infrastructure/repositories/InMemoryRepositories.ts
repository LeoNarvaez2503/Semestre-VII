/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Account, Transaction, AuditLog, SystemConfig } from '../../domain/entities';
import {
  IUserRepository,
  IAccountRepository,
  ITransactionRepository,
  IAuditLogRepository,
  ISystemConfigRepository,
} from '../../domain/repositories';

// Seed initial data helper
const getOrSetLocal = <T>(key: string, initialValue: T): T => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      // Parse dates appropriately
      return JSON.parse(stored, (k, v) => {
        if (k === 'createdAt' || k === 'timestamp' || k === 'date') {
          return new Date(v);
        }
        return v;
      });
    } catch {
      return initialValue;
    }
  }
  localStorage.setItem(key, JSON.stringify(initialValue));
  return initialValue;
};

const saveLocal = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Seed Constants
const INITIAL_USERS: User[] = [
  {
    id: 'client-anthony',
    name: 'Anthony Alain Morales',
    identityId: '1804294812',
    email: 'AnthonyAlainMorales@gmail.com',
    role: 'CLIENTE',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: new Date('2026-01-10T10:00:00Z'),
  },
  {
    id: 'client-segundo',
    name: 'Segundo Intriago Chango',
    identityId: '1805556661',
    email: 'segundo.chango@mushucruna.ec',
    role: 'CLIENTE',
    status: 'ACTIVE',
    twoFactorEnabled: false,
    createdAt: new Date('2026-02-15T11:30:00Z'),
  },
  {
    id: 'cashier-maria',
    name: 'María Juana Pilamunga',
    identityId: '1802345678',
    email: 'maria.juana@mushucruna.ec',
    role: 'CAJERO',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: new Date('2025-05-12T08:00:00Z'),
  },
  {
    id: 'auditor-humberto',
    name: 'Humberto Calero Flores',
    identityId: '1803456789',
    email: 'humberto.calero@mushucruna.ec',
    role: 'AUDITOR',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: new Date('2025-06-20T09:15:00Z'),
  },
  {
    id: 'admin-luis',
    name: 'Abg. Luis Alfonso Chango',
    identityId: '1801234567',
    email: 'luis.chango@mushucruna.ec',
    role: 'ADMIN',
    status: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: new Date('2024-01-01T08:00:00Z'),
  },
];

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-savings-anthony',
    userId: 'client-anthony',
    accountNumber: '100234567',
    type: 'AHORROS',
    balance: 12450.50,
    status: 'ACTIVE',
    createdAt: new Date('2026-01-10T10:05:00Z'),
  },
  {
    id: 'acc-checking-anthony',
    userId: 'client-anthony',
    accountNumber: '200456789',
    type: 'CORRIENTE',
    balance: 1500.00,
    status: 'ACTIVE',
    createdAt: new Date('2026-01-12T14:20:00Z'),
  },
  {
    id: 'acc-savings-segundo',
    userId: 'client-segundo',
    accountNumber: '100555666',
    type: 'AHORROS',
    balance: 850.00,
    status: 'ACTIVE',
    createdAt: new Date('2026-02-15T11:35:00Z'),
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-init-1',
    sourceAccountId: null,
    destinationAccountId: 'acc-savings-anthony',
    type: 'DEPOSIT',
    amount: 10000.00,
    description: 'Depósito Inicial de Apertura en Efectivo',
    timestamp: new Date('2026-01-10T10:10:00Z'),
    ipAddress: '192.168.1.100',
    status: 'SUCCESS',
    fee: 0,
    refCode: 'DEP-773821',
  },
  {
    id: 'tx-init-2',
    sourceAccountId: null,
    destinationAccountId: 'acc-savings-anthony',
    type: 'DEPOSIT',
    amount: 2500.50,
    description: 'Depósito de Cheque Digital - Banco Central',
    timestamp: new Date('2026-02-01T15:30:00Z'),
    ipAddress: '192.168.1.102',
    status: 'SUCCESS',
    fee: 0,
    refCode: 'DEP-102948',
  },
  {
    id: 'tx-init-3',
    sourceAccountId: 'acc-savings-anthony',
    destinationAccountId: 'acc-savings-segundo',
    type: 'TRANSFER',
    amount: 50.00,
    description: 'Transferencia por Servicios Ambientales',
    timestamp: new Date('2026-03-01T09:00:00Z'),
    ipAddress: '192.168.1.102',
    status: 'SUCCESS',
    fee: 0,
    refCode: 'TRF-552194',
  },
  {
    id: 'tx-init-4',
    sourceAccountId: 'acc-checking-anthony',
    destinationAccountId: null,
    type: 'WITHDRAWAL',
    amount: 200.00,
    description: 'Retiro ATM Sucursal Ambato',
    timestamp: new Date('2026-03-15T16:45:00Z'),
    ipAddress: '10.0.8.23',
    status: 'SUCCESS',
    fee: 0,
    refCode: 'OTP-442918',
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-init-1',
    userId: 'admin-luis',
    userName: 'Abg. Luis Alfonso Chango',
    role: 'ADMIN',
    action: 'SYSTEM_BOOTSTRAP',
    details: 'Inicialización de la plataforma financiera de la Cooperativa Mushuc Runa. Parámetros cargados.',
    timestamp: new Date('2026-06-29T08:00:00Z'),
    ipAddress: '10.0.1.1',
  },
  {
    id: 'audit-init-2',
    userId: 'client-anthony',
    userName: 'Anthony Alain Morales',
    role: 'CLIENTE',
    action: 'LOGIN_SUCCESS',
    details: 'Inicio de sesión exitoso. Autenticación de doble factor activa.',
    timestamp: new Date('2026-06-30T07:10:00Z'),
    ipAddress: '192.168.10.45',
  },
  {
    id: 'audit-init-3',
    userId: 'auditor-humberto',
    userName: 'Humberto Calero Flores',
    role: 'AUDITOR',
    action: 'AUDIT_DASHBOARD_ACCESS',
    details: 'Acceso total concedido al log de auditoría global.',
    timestamp: new Date('2026-06-30T07:30:00Z'),
    ipAddress: '10.0.12.14',
  }
];

const INITIAL_CONFIG: SystemConfig = {
  dailyTransferLimit: 5000.00,
  commissionFee: 2.50,
  savingsInterestRate: 6.5,
};

// Storage Keys
const KEYS = {
  USERS: 'mushucruna_users',
  ACCOUNTS: 'mushucruna_accounts',
  TRANSACTIONS: 'mushucruna_transactions',
  AUDIT_LOGS: 'mushucruna_audit_logs',
  CONFIG: 'mushucruna_system_config',
};

export class InMemoryUserRepository implements IUserRepository {
  private users: User[];

  constructor() {
    this.users = getOrSetLocal(KEYS.USERS, INITIAL_USERS);
  }

  async findById(id: string): Promise<User | null> {
    this.refresh();
    return this.users.find(u => u.id === id) || null;
  }

  async findByIdentityId(identityId: string): Promise<User | null> {
    this.refresh();
    return this.users.find(u => u.identityId === identityId) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.refresh();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getAll(): Promise<User[]> {
    this.refresh();
    return [...this.users];
  }

  async save(user: User): Promise<User> {
    this.refresh();
    this.users.push(user);
    saveLocal(KEYS.USERS, this.users);
    return user;
  }

  async update(user: User): Promise<User> {
    this.refresh();
    this.users = this.users.map(u => u.id === user.id ? user : u);
    saveLocal(KEYS.USERS, this.users);
    return user;
  }

  private refresh() {
    this.users = getOrSetLocal(KEYS.USERS, INITIAL_USERS);
  }
}

export class InMemoryAccountRepository implements IAccountRepository {
  private accounts: Account[];

  constructor() {
    this.accounts = getOrSetLocal(KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
  }

  async findById(id: string): Promise<Account | null> {
    this.refresh();
    return this.accounts.find(a => a.id === id) || null;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    this.refresh();
    return this.accounts.find(a => a.accountNumber === accountNumber) || null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    this.refresh();
    return this.accounts.filter(a => a.userId === userId);
  }

  async getAll(): Promise<Account[]> {
    this.refresh();
    return [...this.accounts];
  }

  async save(account: Account): Promise<Account> {
    this.refresh();
    this.accounts.push(account);
    saveLocal(KEYS.ACCOUNTS, this.accounts);
    return account;
  }

  async update(account: Account): Promise<Account> {
    this.refresh();
    this.accounts = this.accounts.map(a => a.id === account.id ? account : a);
    saveLocal(KEYS.ACCOUNTS, this.accounts);
    return account;
  }

  private refresh() {
    this.accounts = getOrSetLocal(KEYS.ACCOUNTS, INITIAL_ACCOUNTS);
  }
}

export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = getOrSetLocal(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  async findById(id: string): Promise<Transaction | null> {
    this.refresh();
    return this.transactions.find(t => t.id === id) || null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    this.refresh();
    return this.transactions.filter(t => t.sourceAccountId === accountId || t.destinationAccountId === accountId);
  }

  async getAll(): Promise<Transaction[]> {
    this.refresh();
    return [...this.transactions];
  }

  async save(transaction: Transaction): Promise<Transaction> {
    this.refresh();
    this.transactions.unshift(transaction); // Unshift so that recent are first
    saveLocal(KEYS.TRANSACTIONS, this.transactions);
    return transaction;
  }

  private refresh() {
    this.transactions = getOrSetLocal(KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }
}

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  private logs: AuditLog[];

  constructor() {
    this.logs = getOrSetLocal(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  async getAll(): Promise<AuditLog[]> {
    this.refresh();
    return [...this.logs];
  }

  async save(log: AuditLog): Promise<AuditLog> {
    this.refresh();
    this.logs.unshift(log); // Unshift so that recent are first
    saveLocal(KEYS.AUDIT_LOGS, this.logs);
    return log;
  }

  private refresh() {
    this.logs = getOrSetLocal(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }
}

export class InMemorySystemConfigRepository implements ISystemConfigRepository {
  private config: SystemConfig;

  constructor() {
    this.config = getOrSetLocal(KEYS.CONFIG, INITIAL_CONFIG);
  }

  async getConfig(): Promise<SystemConfig> {
    this.refresh();
    return { ...this.config };
  }

  async updateConfig(config: SystemConfig): Promise<SystemConfig> {
    this.config = { ...config };
    saveLocal(KEYS.CONFIG, this.config);
    return this.config;
  }

  private refresh() {
    this.config = getOrSetLocal(KEYS.CONFIG, INITIAL_CONFIG);
  }
}
