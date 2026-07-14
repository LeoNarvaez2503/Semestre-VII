/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Account, Transaction, AuditLog, SystemConfig, User, UserRole, UserStatus, AccountStatus } from '../domain/entities';
import {
  IUserRepository,
  IAccountRepository,
  ITransactionRepository,
  IAuditLogRepository,
  ISystemConfigRepository,
} from '../domain/repositories';

// Helper to generate reference codes
const generateRefCode = (prefix: string): string => {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
};

export class DepositUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository,
    private auditLogRepository: IAuditLogRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(params: {
    accountId: string;
    amount: number;
    description: string;
    ipAddress: string;
    executorId: string;
  }): Promise<Transaction> {
    const { accountId, amount, description, ipAddress, executorId } = params;

    // 1. Data Validation
    if (amount <= 0) {
      throw new Error('El monto del depósito debe ser mayor a cero.');
    }
    if (amount > 1000000) {
      throw new Error('Monto excede el límite máximo por transacción de depósito.');
    }

    const executor = await this.userRepository.findById(executorId);
    if (!executor) {
      throw new Error('Usuario ejecutor no encontrado.');
    }

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('La cuenta destino no existe.');
    }

    if (account.status !== 'ACTIVE') {
      throw new Error(`La cuenta destino está ${account.status === 'FROZEN' ? 'CONGELADA' : 'BLOQUEADA'} y no puede recibir depósitos.`);
    }

    // 2. Business Logic Execution
    const previousBalance = account.balance;
    account.balance = Number((account.balance + amount).toFixed(2));
    
    let transaction: Transaction;
    try {
      await this.accountRepository.update(account);

      transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceAccountId: null,
        destinationAccountId: account.id,
        type: 'DEPOSIT',
        amount,
        description,
        timestamp: new Date(),
        ipAddress,
        status: 'SUCCESS',
        fee: 0,
        refCode: generateRefCode('DEP'),
      };

      await this.transactionRepository.save(transaction);

      // Audit Log
      const clientUser = await this.userRepository.findById(account.userId);
      const auditDetails = `Depósito de $${amount.toFixed(2)} registrado en cuenta #${account.accountNumber}. Saldo previo: $${previousBalance.toFixed(2)}, nuevo saldo: $${account.balance.toFixed(2)}.`;
      
      await this.auditLogRepository.save({
        id: `audit-${Date.now()}`,
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'DEPOSIT_SUCCESS',
        details: auditDetails,
        timestamp: new Date(),
        ipAddress,
      });

      return transaction;
    } catch (error) {
      // Rollback memory state if write failed
      account.balance = previousBalance;
      throw new Error(`Error al procesar el depósito: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }
}

export class WithdrawUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository,
    private auditLogRepository: IAuditLogRepository,
    private userRepository: IUserRepository,
    private configRepository: ISystemConfigRepository
  ) {}

  async execute(params: {
    accountId: string;
    amount: number;
    description: string;
    ipAddress: string;
    executorId: string;
    channel: 'ATM' | 'VENTANILLA';
  }): Promise<{ transaction: Transaction; otpCode?: string }> {
    const { accountId, amount, description, ipAddress, executorId, channel } = params;

    // 1. Validation
    if (amount <= 0) {
      throw new Error('El monto del retiro debe ser mayor a cero.');
    }

    const executor = await this.userRepository.findById(executorId);
    if (!executor) {
      throw new Error('Usuario ejecutor no encontrado.');
    }

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('La cuenta no existe.');
    }

    if (account.status !== 'ACTIVE') {
      throw new Error(`La cuenta está ${account.status === 'FROZEN' ? 'CONGELADA' : 'BLOQUEADA'} y no puede realizar retiros.`);
    }

    if (account.balance < amount) {
      throw new Error(`Fondos insuficientes. Saldo disponible: $${account.balance.toFixed(2)}.`);
    }

    // Check system config limits for ATM
    const config = await this.configRepository.getConfig();
    if (channel === 'ATM' && amount > 500) {
      throw new Error('Límite de retiro en cajero automático (ATM) es de $500.00 por transacción.');
    }

    // 2. Execution
    const previousBalance = account.balance;
    let otpCode: string | undefined;

    if (executor.role === 'CLIENTE' && channel === 'ATM') {
      // Simulation of generating OTP code for physical ATM channels
      otpCode = generateRefCode('OTP');
      
      // We deduct the balance as "pending/reserved" or directly deduct (let's deduct for direct simulation)
      account.balance = Number((account.balance - amount).toFixed(2));
      await this.accountRepository.update(account);

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        sourceAccountId: account.id,
        destinationAccountId: null,
        type: 'WITHDRAWAL',
        amount,
        description: `${description} (Retiro por ATM código ${otpCode})`,
        timestamp: new Date(),
        ipAddress,
        status: 'SUCCESS',
        fee: 0,
        refCode: otpCode,
      };

      await this.transactionRepository.save(transaction);

      await this.auditLogRepository.save({
        id: `audit-${Date.now()}`,
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'ATM_WITHDRAWAL_REQUESTED',
        details: `Retiro por ATM solicitado por el cliente. Monto: $${amount.toFixed(2)}, Código: ${otpCode}.`,
        timestamp: new Date(),
        ipAddress,
      });

      return { transaction, otpCode };
    } else {
      // Direct physical window withdrawal by cashier
      account.balance = Number((account.balance - amount).toFixed(2));
      await this.accountRepository.update(account);

      const transaction: Transaction = {
        id: `tx-${Date.now()}`,
        sourceAccountId: account.id,
        destinationAccountId: null,
        type: 'WITHDRAWAL',
        amount,
        description: `${description} (Retiro por Ventanilla)`,
        timestamp: new Date(),
        ipAddress,
        status: 'SUCCESS',
        fee: 0,
        refCode: generateRefCode('REC'),
      };

      await this.transactionRepository.save(transaction);

      await this.auditLogRepository.save({
        id: `audit-${Date.now()}`,
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'CASHIER_WITHDRAWAL_COMPLETED',
        details: `Retiro por ventanilla autorizado por cajero (${executor.name}) para la cuenta #${account.accountNumber}. Monto: $${amount.toFixed(2)}.`,
        timestamp: new Date(),
        ipAddress,
      });

      return { transaction };
    }
  }
}

export class TransferUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository,
    private auditLogRepository: IAuditLogRepository,
    private userRepository: IUserRepository,
    private configRepository: ISystemConfigRepository
  ) {}

  async execute(params: {
    sourceAccountId: string;
    destinationAccountNumber: string;
    amount: number;
    description: string;
    ipAddress: string;
    executorId: string;
    isExternal: boolean;
  }): Promise<Transaction> {
    const { sourceAccountId, destinationAccountNumber, amount, description, ipAddress, executorId, isExternal } = params;

    // 1. Data Validation
    if (amount <= 0) {
      throw new Error('El monto de la transferencia debe ser mayor a cero.');
    }

    const executor = await this.userRepository.findById(executorId);
    if (!executor) {
      throw new Error('Usuario ejecutor no encontrado.');
    }

    const sourceAccount = await this.accountRepository.findById(sourceAccountId);
    if (!sourceAccount) {
      throw new Error('La cuenta de origen no existe.');
    }

    if (sourceAccount.status !== 'ACTIVE') {
      throw new Error(`La cuenta origen está ${sourceAccount.status === 'FROZEN' ? 'CONGELADA' : 'BLOQUEADA'}. Transacción denegada.`);
    }

    // Security check: If executor is CLIENTE, they must own the source account
    if (executor.role === 'CLIENTE' && sourceAccount.userId !== executor.id) {
      throw new Error('Acceso denegado: No posee privilegios sobre la cuenta de origen.');
    }

    // Check system config (Daily Limit & Commissions)
    const config = await this.configRepository.getConfig();
    
    // Check if daily transfer limit is exceeded
    const todayTransactions = await this.transactionRepository.findByAccountId(sourceAccount.id);
    const today = new Date().toDateString();
    const totalTodayTransferred = todayTransactions
      .filter(tx => tx.type === 'TRANSFER' && tx.status === 'SUCCESS' && new Date(tx.timestamp).toDateString() === today)
      .reduce((sum, tx) => sum + tx.amount, 0);

    if (totalTodayTransferred + amount > config.dailyTransferLimit) {
      throw new Error(`Límite diario de transferencias excedido. Límite diario: $${config.dailyTransferLimit.toFixed(2)}, Transferido hoy: $${totalTodayTransferred.toFixed(2)}, Intento: $${amount.toFixed(2)}.`);
    }

    const fee = isExternal ? config.commissionFee : 0;
    const totalDeduction = Number((amount + fee).toFixed(2));

    if (sourceAccount.balance < totalDeduction) {
      throw new Error(`Fondos insuficientes para la transferencia + comisión ($${fee.toFixed(2)}). Requerido: $${totalDeduction.toFixed(2)}, Disponible: $${sourceAccount.balance.toFixed(2)}.`);
    }

    // Validate destination account
    const destinationAccount = await this.accountRepository.findByAccountNumber(destinationAccountNumber);
    if (!destinationAccount) {
      throw new Error(`La cuenta de destino #${destinationAccountNumber} no existe en la cooperativa.`);
    }

    if (destinationAccount.id === sourceAccount.id) {
      throw new Error('No es posible transferir fondos a la misma cuenta de origen.');
    }

    if (destinationAccount.status !== 'ACTIVE') {
      throw new Error(`La cuenta destino está ${destinationAccount.status === 'FROZEN' ? 'CONGELADA' : 'BLOQUEADA'} y no puede recibir fondos.`);
    }

    // 2. Atomic Transaction Simulation with Rollback Guard
    const sourcePreviousBalance = sourceAccount.balance;
    const destinationPreviousBalance = destinationAccount.balance;

    // STEP 1: Debit Source Account
    sourceAccount.balance = Number((sourceAccount.balance - totalDeduction).toFixed(2));
    
    try {
      await this.accountRepository.update(sourceAccount);
    } catch (dbError) {
      // Revert in memory (though not saved to DB yet, keep consistent)
      sourceAccount.balance = sourcePreviousBalance;
      throw new Error(`Error en el débito inicial: ${dbError instanceof Error ? dbError.message : 'Unknown'}`);
    }

    // STEP 2: Credit Destination Account
    destinationAccount.balance = Number((destinationAccount.balance + amount).toFixed(2));

    try {
      await this.accountRepository.update(destinationAccount);
    } catch (creditError) {
      // CRITICAL ROLLBACK: Credit failed, so we MUST revert the debit on the source account!
      sourceAccount.balance = sourcePreviousBalance;
      await this.accountRepository.update(sourceAccount); // Revert write in database

      // Register failed transaction for audit trail and compliance
      const failedTransaction: Transaction = {
        id: `tx-failed-${Date.now()}`,
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
        type: 'TRANSFER',
        amount,
        description: `${description} [REVERTIDA POR FALLO EN CRÉDITO]`,
        timestamp: new Date(),
        ipAddress,
        status: 'FAILED',
        fee,
        refCode: generateRefCode('ERR'),
      };
      await this.transactionRepository.save(failedTransaction);

      await this.auditLogRepository.save({
        id: `audit-err-${Date.now()}`,
        userId: executor.id,
        userName: executor.name,
        role: executor.role,
        action: 'TRANSFER_ROLLBACK_TRIGGERED',
        details: `Transferencia fallida. Se aplicó rollback en cuenta #${sourceAccount.accountNumber}. Monto intentado: $${amount.toFixed(2)}. Razón: Fallo al acreditar cuenta destino.`,
        timestamp: new Date(),
        ipAddress,
      });

      throw new Error(`Operación revertida. No se pudo acreditar la cuenta destino. Detalle: ${creditError instanceof Error ? creditError.message : 'Unknown'}`);
    }

    // STEP 3: Transaction successfully completed
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      sourceAccountId: sourceAccount.id,
      destinationAccountId: destinationAccount.id,
      type: 'TRANSFER',
      amount,
      description,
      timestamp: new Date(),
      ipAddress,
      status: 'SUCCESS',
      fee,
      refCode: generateRefCode('TRF'),
    };

    await this.transactionRepository.save(transaction);

    // Audit logs
    await this.auditLogRepository.save({
      id: `audit-${Date.now()}`,
      userId: executor.id,
      userName: executor.name,
      role: executor.role,
      action: 'TRANSFER_SUCCESS',
      details: `Transferencia exitosa de la cuenta #${sourceAccount.accountNumber} a la cuenta #${destinationAccount.accountNumber}. Monto: $${amount.toFixed(2)}, Comisión: $${fee.toFixed(2)}.`,
      timestamp: new Date(),
      ipAddress,
    });

    return transaction;
  }
}

export class AuditorUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private auditLogRepository: IAuditLogRepository,
    private userRepository: IUserRepository
  ) {}

  async toggleAccountFreeze(params: {
    accountId: string;
    action: 'FREEZE' | 'UNFREEZE';
    ipAddress: string;
    auditorId: string;
    reason: string;
  }): Promise<Account> {
    const { accountId, action, ipAddress, auditorId, reason } = params;

    const auditor = await this.userRepository.findById(auditorId);
    if (!auditor || auditor.role !== 'AUDITOR') {
      throw new Error('Solo el perfil de Auditor posee permisos para congelar o descongelar cuentas.');
    }

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('La cuenta especificada no existe.');
    }

    const previousStatus = account.status;
    
    if (action === 'FREEZE') {
      if (account.status === 'FROZEN') {
        throw new Error('La cuenta ya se encuentra congelada.');
      }
      account.status = 'FROZEN';
    } else {
      if (account.status !== 'FROZEN') {
        throw new Error('La cuenta no se encuentra congelada.');
      }
      account.status = 'ACTIVE';
    }

    await this.accountRepository.update(account);

    // Audit Log
    const clientUser = await this.userRepository.findById(account.userId);
    const actionName = action === 'FREEZE' ? 'CONGELAMIENTO_CUENTA' : 'DESCONGELAMIENTO_CUENTA';
    const actionDetails = `${action === 'FREEZE' ? 'Congelamiento' : 'Descongelamiento'} de la cuenta #${account.accountNumber} de ${clientUser?.name || 'Cliente'} por el Auditor ${auditor.name}. Razón: ${reason}`;

    await this.auditLogRepository.save({
      id: `audit-${Date.now()}`,
      userId: auditor.id,
      userName: auditor.name,
      role: auditor.role,
      action: actionName,
      details: actionDetails,
      timestamp: new Date(),
      ipAddress,
    });

    return account;
  }
}

export class AdminUseCase {
  constructor(
    private userRepository: IUserRepository,
    private configRepository: ISystemConfigRepository,
    private auditLogRepository: IAuditLogRepository
  ) {}

  async createEmployee(params: {
    name: string;
    identityId: string;
    email: string;
    role: 'CAJERO' | 'AUDITOR';
    ipAddress: string;
    adminId: string;
  }): Promise<User> {
    const { name, identityId, email, role, ipAddress, adminId } = params;

    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Acceso denegado: Solo el Administrador puede gestionar empleados.');
    }

    // Check duplicate identity or email
    const existingByIdentity = await this.userRepository.findByIdentityId(identityId);
    if (existingByIdentity) {
      throw new Error('Ya existe un usuario registrado con esa Cédula/Identificación.');
    }

    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail) {
      throw new Error('Ya existe un usuario registrado con ese correo electrónico.');
    }

    const newEmployee: User = {
      id: `emp-${Date.now()}`,
      name,
      identityId,
      email,
      role,
      status: 'ACTIVE',
      twoFactorEnabled: false,
      createdAt: new Date(),
    };

    await this.userRepository.save(newEmployee);

    await this.auditLogRepository.save({
      id: `audit-${Date.now()}`,
      userId: admin.id,
      userName: admin.name,
      role: admin.role,
      action: 'EMPLOYEE_CREATED',
      details: `Creación de empleado: ${name} con rol de ${role} por el Administrador ${admin.name}.`,
      timestamp: new Date(),
      ipAddress,
    });

    return newEmployee;
  }

  async toggleEmployeeStatus(params: {
    employeeId: string;
    action: 'ACTIVATE' | 'SUSPEND';
    ipAddress: string;
    adminId: string;
  }): Promise<User> {
    const { employeeId, action, ipAddress, adminId } = params;

    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Acceso denegado: Solo el Administrador puede suspender empleados.');
    }

    const employee = await this.userRepository.findById(employeeId);
    if (!employee) {
      throw new Error('El empleado no existe.');
    }

    if (employee.role === 'ADMIN') {
      throw new Error('No es posible suspender o modificar la cuenta de un Administrador de sistema.');
    }

    employee.status = action === 'ACTIVATE' ? 'ACTIVE' : 'SUSPENDED';
    await this.userRepository.update(employee);

    await this.auditLogRepository.save({
      id: `audit-${Date.now()}`,
      userId: admin.id,
      userName: admin.name,
      role: admin.role,
      action: action === 'ACTIVATE' ? 'EMPLOYEE_ACTIVATED' : 'EMPLOYEE_SUSPENDED',
      details: `${action === 'ACTIVATE' ? 'Activación' : 'Suspensión'} del empleado ${employee.name} (${employee.role}) por el Administrador ${admin.name}.`,
      timestamp: new Date(),
      ipAddress,
    });

    return employee;
  }

  async updateSystemConfig(params: {
    dailyTransferLimit: number;
    commissionFee: number;
    savingsInterestRate: number;
    ipAddress: string;
    adminId: string;
  }): Promise<SystemConfig> {
    const { dailyTransferLimit, commissionFee, savingsInterestRate, ipAddress, adminId } = params;

    const admin = await this.userRepository.findById(adminId);
    if (!admin || admin.role !== 'ADMIN') {
      throw new Error('Acceso denegado: Solo el Administrador puede modificar los parámetros del sistema.');
    }

    if (dailyTransferLimit < 10 || commissionFee < 0 || savingsInterestRate < 0) {
      throw new Error('Valores de configuración inválidos. Deben ser mayores o iguales a cero y el límite diario debe ser realista.');
    }

    const updatedConfig: SystemConfig = {
      dailyTransferLimit,
      commissionFee,
      savingsInterestRate,
    };

    await this.configRepository.updateConfig(updatedConfig);

    await this.auditLogRepository.save({
      id: `audit-${Date.now()}`,
      userId: admin.id,
      userName: admin.name,
      role: admin.role,
      action: 'SYSTEM_CONFIG_UPDATED',
      details: `Actualización de parámetros del sistema por ${admin.name}. Nuevo límite diario: $${dailyTransferLimit.toFixed(2)}, Comisión: $${commissionFee.toFixed(2)}, Tasa de Interés: ${savingsInterestRate}%.`,
      timestamp: new Date(),
      ipAddress,
    });

    return updatedConfig;
  }
}
