/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Account, Transaction, AuditLog, SystemConfig, UserRole } from '../../domain/entities';
import {
  InMemoryUserRepository,
  InMemoryAccountRepository,
  InMemoryTransactionRepository,
  InMemoryAuditLogRepository,
  InMemorySystemConfigRepository,
} from '../repositories/InMemoryRepositories';
import {
  DepositUseCase,
  WithdrawUseCase,
  TransferUseCase,
  AuditorUseCase,
  AdminUseCase,
} from '../../application/use-cases';

// Simulated IP address of the browser instance
const getSimulatedIP = () => {
  return '190.152.12.98'; // standard Ecuador public IP simulation
};

interface BankContextType {
  currentUser: User | null;
  activeRole: UserRole;
  allUsers: User[];
  allAccounts: Account[];
  currentUserAccounts: Account[];
  transactions: Transaction[];
  auditLogs: AuditLog[];
  systemConfig: SystemConfig | null;
  isLoading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  
  // Actions
  switchRole: (role: UserRole) => Promise<void>;
  deposit: (accountId: string, amount: number, description: string) => Promise<void>;
  withdraw: (accountId: string, amount: number, description: string, channel: 'ATM' | 'VENTANILLA') => Promise<{ transaction: Transaction; otpCode?: string }>;
  transfer: (sourceAccountId: string, destinationAccountNumber: string, amount: number, description: string, isExternal: boolean) => Promise<void>;
  toggleFreeze: (accountId: string, action: 'FREEZE' | 'UNFREEZE', reason: string) => Promise<void>;
  createEmployee: (name: string, identityId: string, email: string, role: 'CAJERO' | 'AUDITOR') => Promise<void>;
  toggleEmployeeStatus: (employeeId: string, action: 'ACTIVATE' | 'SUSPEND') => Promise<void>;
  updateConfig: (dailyLimit: number, commission: number, interest: number) => Promise<void>;
  clearNotifications: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

// Core repositories instantiated as singletons at infrastructure layer
const userRepository = new InMemoryUserRepository();
const accountRepository = new InMemoryAccountRepository();
const transactionRepository = new InMemoryTransactionRepository();
const auditLogRepository = new InMemoryAuditLogRepository();
const configRepository = new InMemorySystemConfigRepository();

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('CLIENTE');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [currentUserAccounts, setCurrentUserAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load all initial states
  const refreshState = async () => {
    setIsLoading(true);
    try {
      const users = await userRepository.getAll();
      const accounts = await accountRepository.getAll();
      const txs = await transactionRepository.getAll();
      const logs = await auditLogRepository.getAll();
      const conf = await configRepository.getConfig();
      
      setAllUsers(users);
      setAllAccounts(accounts);
      setTransactions(txs);
      setAuditLogs(logs);
      setSystemConfig(conf);

      // Find current user matching current role
      const matchedUser = users.find(u => u.role === activeRole && u.status === 'ACTIVE');
      if (matchedUser) {
        setCurrentUser(matchedUser);
        const userAccs = accounts.filter(a => a.userId === matchedUser.id);
        setCurrentUserAccounts(userAccs);
      } else {
        setCurrentUser(null);
        setCurrentUserAccounts([]);
      }
    } catch (e) {
      setErrorMsg('Error al sincronizar datos bancarios localmente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, [activeRole]);

  const clearNotifications = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  // 1. Role switcher (Simulation of authorization scopes)
  const switchRole = async (role: UserRole) => {
    clearNotifications();
    setActiveRole(role);
    
    // Log role switch audit
    try {
      const users = await userRepository.getAll();
      const matchedUser = users.find(u => u.role === role);
      if (matchedUser) {
        await auditLogRepository.save({
          id: `audit-switch-${Date.now()}`,
          userId: matchedUser.id,
          userName: matchedUser.name,
          role: matchedUser.role,
          action: 'AUTH_ROLE_SWITCH',
          details: `El usuario cambió exitosamente al rol de ${role}. Acceso autorizado bajo IP ${getSimulatedIP()}.`,
          timestamp: new Date(),
          ipAddress: getSimulatedIP(),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Deposit operation
  const deposit = async (accountId: string, amount: number, description: string) => {
    clearNotifications();
    if (!currentUser) return;
    
    try {
      const useCase = new DepositUseCase(accountRepository, transactionRepository, auditLogRepository, userRepository);
      await useCase.execute({
        accountId,
        amount,
        description,
        ipAddress: getSimulatedIP(),
        executorId: currentUser.id,
      });
      
      setSuccessMsg(`Depósito de $${amount.toFixed(2)} realizado con éxito.`);
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido al realizar el depósito.');
      throw err;
    }
  };

  // 3. Withdraw operation
  const withdraw = async (accountId: string, amount: number, description: string, channel: 'ATM' | 'VENTANILLA') => {
    clearNotifications();
    if (!currentUser) throw new Error('Usuario ejecutor no autenticado.');
    
    try {
      const useCase = new WithdrawUseCase(accountRepository, transactionRepository, auditLogRepository, userRepository, configRepository);
      const result = await useCase.execute({
        accountId,
        amount,
        description,
        ipAddress: getSimulatedIP(),
        executorId: currentUser.id,
        channel,
      });
      
      if (result.otpCode) {
        setSuccessMsg(`Código OTP generado para cajero: ${result.otpCode}. Retire $${amount.toFixed(2)} en ventanilla o cajero.`);
      } else {
        setSuccessMsg(`Retiro de $${amount.toFixed(2)} procesado exitosamente por ventanilla.`);
      }
      await refreshState();
      return result;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido al realizar el retiro.');
      throw err;
    }
  };

  // 4. Transfer operation
  const transfer = async (sourceAccountId: string, destinationAccountNumber: string, amount: number, description: string, isExternal: boolean) => {
    clearNotifications();
    if (!currentUser) return;

    try {
      const useCase = new TransferUseCase(accountRepository, transactionRepository, auditLogRepository, userRepository, configRepository);
      await useCase.execute({
        sourceAccountId,
        destinationAccountNumber,
        amount,
        description,
        ipAddress: getSimulatedIP(),
        executorId: currentUser.id,
        isExternal,
      });

      setSuccessMsg(`Transferencia de $${amount.toFixed(2)} acreditada con éxito.`);
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido en la transferencia.');
      throw err;
    }
  };

  // 5. Freeze Account toggle (Auditor exclusive)
  const toggleFreeze = async (accountId: string, action: 'FREEZE' | 'UNFREEZE', reason: string) => {
    clearNotifications();
    if (!currentUser) return;

    try {
      const useCase = new AuditorUseCase(accountRepository, auditLogRepository, userRepository);
      await useCase.toggleAccountFreeze({
        accountId,
        action,
        ipAddress: getSimulatedIP(),
        auditorId: currentUser.id,
        reason,
      });

      setSuccessMsg(`La cuenta fue ${action === 'FREEZE' ? 'congelada' : 'descongelada'} exitosamente.`);
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al modificar el estado de la cuenta.');
      throw err;
    }
  };

  // 6. Create Employee (Admin exclusive)
  const createEmployee = async (name: string, identityId: string, email: string, role: 'CAJERO' | 'AUDITOR') => {
    clearNotifications();
    if (!currentUser) return;

    try {
      const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
      await useCase.createEmployee({
        name,
        identityId,
        email,
        role,
        ipAddress: getSimulatedIP(),
        adminId: currentUser.id,
      });

      setSuccessMsg(`Empleado ${name} con perfil ${role} registrado correctamente.`);
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar el empleado.');
      throw err;
    }
  };

  // 7. Toggle Employee status (Admin exclusive)
  const toggleEmployeeStatus = async (employeeId: string, action: 'ACTIVATE' | 'SUSPEND') => {
    clearNotifications();
    if (!currentUser) return;

    try {
      const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
      await useCase.toggleEmployeeStatus({
        employeeId,
        action,
        ipAddress: getSimulatedIP(),
        adminId: currentUser.id,
      });

      setSuccessMsg(`Empleado ${action === 'ACTIVATE' ? 'activado' : 'suspendido'} con éxito.`);
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al modificar el estado del empleado.');
      throw err;
    }
  };

  // 8. Update parameters (Admin exclusive)
  const updateConfig = async (dailyLimit: number, commission: number, interest: number) => {
    clearNotifications();
    if (!currentUser) return;

    try {
      const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
      await useCase.updateSystemConfig({
        dailyTransferLimit: dailyLimit,
        commissionFee: commission,
        savingsInterestRate: interest,
        ipAddress: getSimulatedIP(),
        adminId: currentUser.id,
      });

      setSuccessMsg('Configuración y reglas del negocio actualizadas correctamente.');
      await refreshState();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al actualizar configuración.');
      throw err;
    }
  };

  return (
    <BankContext.Provider
      value={{
        currentUser,
        activeRole,
        allUsers,
        allAccounts,
        currentUserAccounts,
        transactions,
        auditLogs,
        systemConfig,
        isLoading,
        errorMsg,
        successMsg,
        switchRole,
        deposit,
        withdraw,
        transfer,
        toggleFreeze,
        createEmployee,
        toggleEmployeeStatus,
        updateConfig,
        clearNotifications,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};
