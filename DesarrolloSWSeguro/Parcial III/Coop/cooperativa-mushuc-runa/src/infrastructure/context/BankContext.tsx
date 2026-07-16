/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { backendApi } from '../api/BackendApi';

const SESSION_KEY = 'mushucruna_active_session';
export const DEMO_PASSWORD = 'Demo2026!';
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';

const getSimulatedIP = () => '190.152.12.98';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type OperationStatus = 'running' | 'success' | 'error';

export interface SimulatedOperation {
  id: string;
  title: string;
  steps: string[];
  currentStep: number;
  status: OperationStatus;
}

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
  operation: SimulatedOperation | null;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

const userRepository = new InMemoryUserRepository();
const accountRepository = new InMemoryAccountRepository();
const transactionRepository = new InMemoryTransactionRepository();
const auditLogRepository = new InMemoryAuditLogRepository();
const configRepository = new InMemorySystemConfigRepository();

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionUserId, setSessionUserId] = useState<string | null>(() => localStorage.getItem(SESSION_KEY));
  const [activeRole, setActiveRole] = useState<UserRole>('CLIENTE');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [currentUserAccounts, setCurrentUserAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [operation, setOperation] = useState<SimulatedOperation | null>(null);

  const refreshState = async (userIdOverride = sessionUserId) => {
    setIsLoading(true);
    try {
      const [users, accounts, txs, logs, conf] = USE_BACKEND
        ? await Promise.all([
            backendApi.getUsers(),
            backendApi.getAccounts(),
            backendApi.getTransactions(),
            backendApi.getAuditLogs(),
            backendApi.getConfig(),
          ])
        : await Promise.all([
            userRepository.getAll(),
            accountRepository.getAll(),
            transactionRepository.getAll(),
            auditLogRepository.getAll(),
            configRepository.getConfig(),
          ]);
      const sessionUser = userIdOverride
        ? users.find(user => user.id === userIdOverride && user.status === 'ACTIVE') || null
        : null;

      const parsedConf = conf ? {
        ...conf,
        dailyTransferLimit: Number(conf.dailyTransferLimit),
        commissionFee: Number(conf.commissionFee),
        savingsInterestRate: Number(conf.savingsInterestRate)
      } : conf;

      const parsedAccounts = accounts.map(a => ({
        ...a,
        balance: Number(a.balance)
      }));

      const parsedTxs = txs.map(t => ({
        ...t,
        amount: Number(t.amount),
        fee: Number(t.fee)
      }));

      setAllUsers(users);
      setAllAccounts(parsedAccounts);
      setTransactions(parsedTxs);
      setAuditLogs(logs);
      setSystemConfig(parsedConf);
      setCurrentUser(sessionUser);

      if (sessionUser) {
        setActiveRole(sessionUser.role);
        setCurrentUserAccounts(parsedAccounts.filter(account => account.userId === sessionUser.id));
      } else {
        setCurrentUserAccounts([]);
      }
    } catch {
      setErrorMsg(USE_BACKEND ? 'Error al sincronizar con los microservicios NestJS.' : 'Error al sincronizar datos bancarios localmente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
  }, [sessionUserId]);

  const clearNotifications = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const runSimulatedOperation = async <T,>(
    title: string,
    steps: string[],
    action: () => Promise<T>
  ): Promise<T> => {
    const operationId = `op-${Date.now()}`;
    setOperation({ id: operationId, title, steps, currentStep: 0, status: 'running' });

    try {
      for (let stepIndex = 0; stepIndex < steps.length - 1; stepIndex += 1) {
        await wait(320);
        setOperation({ id: operationId, title, steps, currentStep: stepIndex + 1, status: 'running' });
      }

      const result = await action();
      setOperation({ id: operationId, title, steps, currentStep: steps.length - 1, status: 'success' });
      return result;
    } catch (err) {
      setOperation({ id: operationId, title, steps, currentStep: steps.length - 1, status: 'error' });
      throw err;
    }
  };

  const login = async (identifier: string, password: string) => {
    clearNotifications();

    await runSimulatedOperation(
      'Autenticacion de usuario',
      ['Validando credenciales locales', 'Cargando permisos del rol', 'Registrando acceso simulado'],
      async () => {
        if (USE_BACKEND) {
          const matchedUser = await backendApi.login(identifier, password, getSimulatedIP());
          localStorage.setItem(SESSION_KEY, matchedUser.id);
          setSessionUserId(matchedUser.id);
          setCurrentUser(matchedUser);
          setActiveRole(matchedUser.role);
          await refreshState(matchedUser.id);
          setSuccessMsg(`Bienvenido, ${matchedUser.name}. Rol activo: ${matchedUser.role}.`);
          return;
        }

        const users = await userRepository.getAll();
        const normalizedIdentifier = identifier.trim().toLowerCase();
        const matchedUser = users.find(user =>
          user.email.toLowerCase() === normalizedIdentifier ||
          user.identityId === identifier.trim()
        );

        if (!matchedUser || password !== DEMO_PASSWORD) {
          await auditLogRepository.save({
            id: `audit-login-failed-${Date.now()}`,
            userId: 'anonymous',
            userName: identifier.trim() || 'Usuario desconocido',
            role: 'CLIENTE',
            action: 'LOGIN_FAILED',
            details: `Intento de inicio de sesion rechazado para ${identifier || 'credencial vacia'}.`,
            timestamp: new Date(),
            ipAddress: getSimulatedIP(),
          });
          throw new Error('Credenciales invalidas. Use un usuario demo y la clave Demo2026!.');
        }

        if (matchedUser.status !== 'ACTIVE') {
          throw new Error('Usuario suspendido. El acceso al sistema esta bloqueado para este perfil.');
        }

        localStorage.setItem(SESSION_KEY, matchedUser.id);
        setSessionUserId(matchedUser.id);
        setCurrentUser(matchedUser);
        setActiveRole(matchedUser.role);

        await auditLogRepository.save({
          id: `audit-login-${Date.now()}`,
          userId: matchedUser.id,
          userName: matchedUser.name,
          role: matchedUser.role,
          action: 'LOGIN_SUCCESS',
          details: `Inicio de sesion simulado para rol ${matchedUser.role}. Permisos aplicados desde almacenamiento local.`,
          timestamp: new Date(),
          ipAddress: getSimulatedIP(),
        });

        await refreshState(matchedUser.id);
        setSuccessMsg(`Bienvenido, ${matchedUser.name}. Rol activo: ${matchedUser.role}.`);
      }
    );
  };

  const logout = async () => {
    clearNotifications();
    if (currentUser) {
      if (!USE_BACKEND) await auditLogRepository.save({
        id: `audit-logout-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        role: currentUser.role,
        action: 'LOGOUT_SUCCESS',
        details: 'Cierre de sesion simulado desde la interfaz.',
        timestamp: new Date(),
        ipAddress: getSimulatedIP(),
      });
    }

    localStorage.removeItem(SESSION_KEY);
    setSessionUserId(null);
    setCurrentUser(null);
    setCurrentUserAccounts([]);
    await refreshState(null);
  };

  const switchRole = async (role: UserRole) => {
    clearNotifications();

    if (!currentUser || currentUser.role !== role) {
      setErrorMsg(`Acceso denegado: su sesion pertenece al rol ${currentUser?.role || 'NO_AUTENTICADO'} y no puede asumir ${role}.`);
      return;
    }

    if (!USE_BACKEND) await auditLogRepository.save({
      id: `audit-scope-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      action: 'AUTH_SCOPE_CONFIRMED',
      details: `Permisos confirmados para rol ${role}. Acceso autorizado bajo IP ${getSimulatedIP()}.`,
      timestamp: new Date(),
      ipAddress: getSimulatedIP(),
    });
  };

  const deposit = async (accountId: string, amount: number, description: string) => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Procesando deposito',
      ['Validando rol y cuenta destino', 'Registrando movimiento contable', 'Firmando comprobante de auditoria'],
      async () => {
        if (!['CLIENTE', 'CAJERO'].includes(currentUser.role)) {
          throw new Error('Acceso denegado: este rol no puede registrar depositos.');
        }

        if (currentUser.role === 'CLIENTE' && !currentUserAccounts.some(account => account.id === accountId)) {
          throw new Error('Acceso denegado: el cliente solo puede depositar en sus propias cuentas.');
        }

        if (USE_BACKEND) {
          await backendApi.deposit(accountId, amount, description, currentUser.id, getSimulatedIP());
        } else {
          const useCase = new DepositUseCase(accountRepository, transactionRepository, auditLogRepository, userRepository);
          await useCase.execute({
            accountId,
            amount,
            description,
            ipAddress: getSimulatedIP(),
            executorId: currentUser.id,
          });
        }

        setSuccessMsg(`Deposito de $${amount.toFixed(2)} realizado con exito.`);
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido al realizar el deposito.');
      throw err;
    });
  };

  const withdraw = async (accountId: string, amount: number, description: string, channel: 'ATM' | 'VENTANILLA') => {
    clearNotifications();
    if (!currentUser) throw new Error('Usuario ejecutor no autenticado.');

    return runSimulatedOperation(
      channel === 'ATM' ? 'Generando retiro OTP' : 'Procesando retiro por ventanilla',
      ['Validando titularidad y saldo', 'Reservando fondos', 'Emitiendo comprobante seguro'],
      async () => {
        if (currentUser.role === 'CLIENTE' && channel !== 'ATM') {
          throw new Error('Acceso denegado: el cliente solo puede solicitar retiros digitales OTP.');
        }
        if (currentUser.role === 'CAJERO' && channel !== 'VENTANILLA') {
          throw new Error('Acceso denegado: el cajero solo opera retiros por ventanilla.');
        }
        if (!['CLIENTE', 'CAJERO'].includes(currentUser.role)) {
          throw new Error('Acceso denegado: este rol no puede retirar fondos.');
        }
        if (currentUser.role === 'CLIENTE' && !currentUserAccounts.some(account => account.id === accountId)) {
          throw new Error('Acceso denegado: el cliente solo puede retirar desde sus propias cuentas.');
        }

        const result = USE_BACKEND
          ? await backendApi.withdraw(accountId, amount, description, currentUser.id, channel, getSimulatedIP())
          : await new WithdrawUseCase(accountRepository, transactionRepository, auditLogRepository, userRepository, configRepository).execute({
              accountId,
              amount,
              description,
              ipAddress: getSimulatedIP(),
              executorId: currentUser.id,
              channel,
            });

        if (result.otpCode) {
          setSuccessMsg(`Codigo OTP generado para cajero: ${result.otpCode}. Retire $${amount.toFixed(2)} en ventanilla o cajero.`);
        } else {
          setSuccessMsg(`Retiro de $${amount.toFixed(2)} procesado exitosamente por ventanilla.`);
        }
        await refreshState();
        return result;
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido al realizar el retiro.');
      throw err;
    });
  };

  const transfer = async (sourceAccountId: string, destinationAccountNumber: string, amount: number, description: string, isExternal: boolean) => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Autorizando transferencia',
      ['Verificando rol cliente', 'Validando limites y comisiones', 'Aplicando debito y credito atomico'],
      async () => {
        if (currentUser.role !== 'CLIENTE') {
          throw new Error('Acceso denegado: solo el cliente puede iniciar transferencias.');
        }

        if (USE_BACKEND) {
          await backendApi.transfer(sourceAccountId, destinationAccountNumber, amount, description, currentUser.id, isExternal, getSimulatedIP());
        } else {
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
        }

        setSuccessMsg(`Transferencia de $${amount.toFixed(2)} acreditada con exito.`);
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error desconocido en la transferencia.');
      throw err;
    });
  };

  const toggleFreeze = async (accountId: string, action: 'FREEZE' | 'UNFREEZE', reason: string) => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Aplicando medida de auditoria',
      ['Validando rol auditor', 'Actualizando estado de cuenta', 'Sellando evidencia regulatoria'],
      async () => {
        if (currentUser.role !== 'AUDITOR') {
          throw new Error('Acceso denegado: solo el auditor puede congelar o descongelar cuentas.');
        }

        if (USE_BACKEND) {
          await backendApi.toggleFreeze(accountId, action, currentUser.id, reason, getSimulatedIP());
        } else {
          const useCase = new AuditorUseCase(accountRepository, auditLogRepository, userRepository);
          await useCase.toggleAccountFreeze({
            accountId,
            action,
            ipAddress: getSimulatedIP(),
            auditorId: currentUser.id,
            reason,
          });
        }

        setSuccessMsg(`La cuenta fue ${action === 'FREEZE' ? 'congelada' : 'descongelada'} exitosamente.`);
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error al modificar el estado de la cuenta.');
      throw err;
    });
  };

  const createEmployee = async (name: string, identityId: string, email: string, role: 'CAJERO' | 'AUDITOR') => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Registrando empleado',
      ['Validando rol administrador', 'Creando perfil operativo', 'Actualizando bitacora de seguridad'],
      async () => {
        if (currentUser.role !== 'ADMIN') {
          throw new Error('Acceso denegado: solo el administrador puede crear empleados.');
        }

        if (USE_BACKEND) {
          await backendApi.createEmployee(name, identityId, email, role, currentUser.id, getSimulatedIP());
        } else {
          const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
          await useCase.createEmployee({
            name,
            identityId,
            email,
            role,
            ipAddress: getSimulatedIP(),
            adminId: currentUser.id,
          });
        }

        setSuccessMsg(`Empleado ${name} con perfil ${role} registrado correctamente.`);
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar el empleado.');
      throw err;
    });
  };

  const toggleEmployeeStatus = async (employeeId: string, action: 'ACTIVATE' | 'SUSPEND') => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Actualizando estado de empleado',
      ['Validando rol administrador', 'Aplicando cambio de estado', 'Firmando registro de personal'],
      async () => {
        if (currentUser.role !== 'ADMIN') {
          throw new Error('Acceso denegado: solo el administrador puede activar o suspender empleados.');
        }

        if (USE_BACKEND) {
          await backendApi.toggleEmployeeStatus(employeeId, action, currentUser.id, getSimulatedIP());
        } else {
          const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
          await useCase.toggleEmployeeStatus({
            employeeId,
            action,
            ipAddress: getSimulatedIP(),
            adminId: currentUser.id,
          });
        }

        setSuccessMsg(`Empleado ${action === 'ACTIVATE' ? 'activado' : 'suspendido'} con exito.`);
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error al modificar el estado del empleado.');
      throw err;
    });
  };

  const updateConfig = async (dailyLimit: number, commission: number, interest: number) => {
    clearNotifications();
    if (!currentUser) return;

    await runSimulatedOperation(
      'Actualizando reglas del core',
      ['Validando rol administrador', 'Simulando propagacion de parametros', 'Registrando cambio global'],
      async () => {
        if (currentUser.role !== 'ADMIN') {
          throw new Error('Acceso denegado: solo el administrador puede cambiar reglas del negocio.');
        }

        if (USE_BACKEND) {
          await backendApi.updateConfig(dailyLimit, commission, interest, currentUser.id, getSimulatedIP());
        } else {
          const useCase = new AdminUseCase(userRepository, configRepository, auditLogRepository);
          await useCase.updateSystemConfig({
            dailyTransferLimit: dailyLimit,
            commissionFee: commission,
            savingsInterestRate: interest,
            ipAddress: getSimulatedIP(),
            adminId: currentUser.id,
          });
        }

        setSuccessMsg('Configuracion y reglas del negocio actualizadas correctamente.');
        await refreshState();
      }
    ).catch(err => {
      setErrorMsg(err instanceof Error ? err.message : 'Error al actualizar configuracion.');
      throw err;
    });
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
        operation,
        login,
        logout,
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
