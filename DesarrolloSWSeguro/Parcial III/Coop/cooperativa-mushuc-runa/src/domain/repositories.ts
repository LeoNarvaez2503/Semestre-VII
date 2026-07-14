/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Account, Transaction, AuditLog, SystemConfig } from './entities';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByIdentityId(identityId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
}

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findByAccountNumber(accountNumber: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  getAll(): Promise<Account[]>;
  save(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  getAll(): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
}

export interface IAuditLogRepository {
  getAll(): Promise<AuditLog[]>;
  save(log: AuditLog): Promise<AuditLog>;
}

export interface ISystemConfigRepository {
  getConfig(): Promise<SystemConfig>;
  updateConfig(config: SystemConfig): Promise<SystemConfig>;
}
