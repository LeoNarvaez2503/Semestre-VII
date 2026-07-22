export type TicketStatus = 'ACTIVO' | 'PAGADO' | 'CANCELADO';

export interface Ticket {
  id: string;
  id_usuario: string;
  id_vehiculo: string;
  id_espacio: string;
  hora_ingreso: string;
  hora_salida?: string;
  estado: TicketStatus;
  tarifa_total?: number;
  codigo_qr?: string;
}

export interface TicketApiResponse {
  id_ticket: string;
  id_usuario: string;
  id_vehiculo: string;
  id_espacio: string;
  fecha_hora_ingreso: string;
  fecha_hora_salida?: string | null;
  estado_ticket: string;
  valor_recaudado: number;
  codigo_ticket: string;
}
