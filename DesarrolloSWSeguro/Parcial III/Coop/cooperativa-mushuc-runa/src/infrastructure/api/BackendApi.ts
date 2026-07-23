import { Account, AuditLog, SystemConfig, Transaction, User } from '../../domain/entities';

const clientesUrl = import.meta.env.VITE_CLIENTES_API_URL ?? 'http://localhost:4001';
const cuentasUrl = import.meta.env.VITE_CUENTAS_API_URL ?? 'http://localhost:4002';
const transaccionesUrl = import.meta.env.VITE_TRANSACCIONES_API_URL ?? 'http://localhost:4003';

const request = async <T>(baseUrl: string, path: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('mushucruna_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> ?? {}),
  };

  let response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  // Si expira el token (401) y no estamos logueándonos o refrescando, intentamos refrescar
  if (response.status === 401 && !path.includes('/login') && !path.includes('/refresh')) {
    const refreshToken = localStorage.getItem('mushucruna_refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${clientesUrl}/clientes/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          localStorage.setItem('mushucruna_access_token', data.accessToken);
          localStorage.setItem('mushucruna_refresh_token', data.refreshToken);
          
          // Reintentar la petición original con el nuevo token
          headers['Authorization'] = `Bearer ${data.accessToken}`;
          response = await fetch(`${baseUrl}${path}`, {
            ...options,
            headers,
          });
        } else {
          // Si el refresh también falla, forzar logout
          localStorage.removeItem('mushucruna_access_token');
          localStorage.removeItem('mushucruna_refresh_token');
          localStorage.removeItem('mushucruna_active_session');
          window.location.reload();
        }
      } catch (err) {
        console.error('Error refreshing token:', err);
      }
    }
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.error ?? payload?.message ?? 'Error de comunicacion con el backend.';
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

  getAccounts: (userId?: string) => request<Account[]>(cuentasUrl, userId ? `/cuentas?userId=${userId}` : '/cuentas'),
  createAccount: (userId: string, accountNumber: string, type: 'AHORROS' | 'CORRIENTE', balance: number) =>
    request<Account>(cuentasUrl, '/cuentas', {
      method: 'POST',
      body: JSON.stringify({ userId, accountNumber, type, balance }),
    }),
  toggleFreeze: (accountId: string, action: 'FREEZE' | 'UNFREEZE', auditorId: string, reason: string, ipAddress: string) =>
    request<Account>(cuentasUrl, `/cuentas/${accountId}/freeze`, {
      method: 'PATCH',
      body: JSON.stringify({ action, auditorId, reason, ipAddress }),
    }),

  getTransactions: (accountId?: string) => request<Transaction[]>(transaccionesUrl, accountId ? `/transacciones?accountId=${accountId}` : '/transacciones'),
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
