/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'CLIENTE' | 'CAJERO' | 'AUDITOR' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'BLOCKED';
export type AccountType = 'AHORROS' | 'CORRIENTE';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface User {
  id: string;
  name: string;
  identityId: string; // Cédula o pasaporte
  email: string;
  role: UserRole;
  status: UserStatus;
  twoFactorEnabled: boolean;
  createdAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  type: AccountType;
  balance: number;
  status: AccountStatus;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  sourceAccountId: string | null; // null for external/cash deposits
  destinationAccountId: string | null; // null for ATM/cash withdrawals
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  ipAddress: string;
  status: TransactionStatus;
  fee: number;
  refCode: string; // Dynamic QR/OTP or receipt number
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
}

export interface SystemConfig {
  dailyTransferLimit: number;
  commissionFee: number; // Fixed transfer fee in USD
  savingsInterestRate: number; // Percentage, e.g., 5.5 for 5.5%
}
