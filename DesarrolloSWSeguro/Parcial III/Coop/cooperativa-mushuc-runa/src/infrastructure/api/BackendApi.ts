import { Account, AuditLog, SystemConfig, Transaction, User } from '../../domain/entities';

const clientesUrl = import.meta.env.VITE_CLIENTES_API_URL ?? 'http://localhost:4001';
const cuentasUrl = import.meta.env.VITE_CUENTAS_API_URL ?? 'http://localhost:4002';
const transaccionesUrl = import.meta.env.VITE_TRANSACCIONES_API_URL ?? 'http://localhost:4003';

const request = async <T>(baseUrl: string, path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message ?? payload?.error ?? 'Error de comunicacion con el backend.';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return response.json() as Promise<T>;
};

export const backendApi = {
  getUsers: () => request<User[]>(clientesUrl, '/clientes'),
  login: (identifier: string, password: string, ipAddress: string) =>
    request<User>(clientesUrl, '/clientes/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password, ipAddress }),
    }),
  createEmployee: (name: string, identityId: string, email: string, role: 'CAJERO' | 'AUDITOR', adminId: string, ipAddress: string) =>
    request<User>(clientesUrl, '/clientes', {
      method: 'POST',
      body: JSON.stringify({ name, identityId, email, role, adminId, ipAddress }),
    }),
  toggleEmployeeStatus: (employeeId: string, action: 'ACTIVATE' | 'SUSPEND', adminId: string, ipAddress: string) =>
    request<User>(clientesUrl, `/clientes/${employeeId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ action, adminId, ipAddress }),
    }),
  getAuditLogs: () => request<AuditLog[]>(clientesUrl, '/auditoria'),
  getConfig: () => request<SystemConfig>(clientesUrl, '/configuracion'),
  updateConfig: (dailyTransferLimit: number, commissionFee: number, savingsInterestRate: number, adminId: string, ipAddress: string) =>
    request<SystemConfig>(clientesUrl, '/configuracion', {
      method: 'PATCH',
      body: JSON.stringify({ dailyTransferLimit, commissionFee, savingsInterestRate, adminId, ipAddress }),
    }),

  getAccounts: () => request<Account[]>(cuentasUrl, '/cuentas'),
  toggleFreeze: (accountId: string, action: 'FREEZE' | 'UNFREEZE', auditorId: string, reason: string, ipAddress: string) =>
    request<Account>(cuentasUrl, `/cuentas/${accountId}/freeze`, {
      method: 'PATCH',
      body: JSON.stringify({ action, auditorId, reason, ipAddress }),
    }),

  getTransactions: () => request<Transaction[]>(transaccionesUrl, '/transacciones'),
  deposit: (accountId: string, amount: number, description: string, executorId: string, ipAddress: string) =>
    request<Transaction>(transaccionesUrl, '/transacciones/depositos', {
      method: 'POST',
      body: JSON.stringify({ accountId, amount, description, executorId, ipAddress }),
    }),
  withdraw: (accountId: string, amount: number, description: string, executorId: string, channel: 'ATM' | 'VENTANILLA', ipAddress: string) =>
    request<{ transaction: Transaction; otpCode?: string }>(transaccionesUrl, '/transacciones/retiros', {
      method: 'POST',
      body: JSON.stringify({ accountId, amount, description, executorId, channel, ipAddress }),
    }),
  transfer: (
    sourceAccountId: string,
    destinationAccountNumber: string,
    amount: number,
    description: string,
    executorId: string,
    isExternal: boolean,
    ipAddress: string,
  ) =>
    request<Transaction>(transaccionesUrl, '/transacciones/transferencias', {
      method: 'POST',
      body: JSON.stringify({ sourceAccountId, destinationAccountNumber, amount, description, executorId, isExternal, ipAddress }),
    }),
};
