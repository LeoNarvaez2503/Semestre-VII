export interface AuditEvent {
  id: string;
  servicio: string;
  accion: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'SELECT' | string;
  entidad: string;
  datos?: Record<string, any>;
  username?: string;
  rol?: string | null;
  ip?: string;
  mac?: string;
  timestamp: string;
}

export interface AuditFilterOptions {
  searchQuery: string;
  servicio: string;
  accion: string;
  startDate?: string;
  endDate?: string;
}
