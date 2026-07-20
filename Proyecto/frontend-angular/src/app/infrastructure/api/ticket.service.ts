import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket, TicketApiResponse, TicketStatus } from '../../core/models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private gatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) {}

  createTicket(payload: { id_usuario: string; id_vehiculo: string; id_espacio: string }): Observable<Ticket> {
    return this.http.post<TicketApiResponse>(`${this.gatewayUrl}/ticket/crear`, payload).pipe(
      map(ticket => this.fromApi(ticket))
    );
  }

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<TicketApiResponse[]>(`${this.gatewayUrl}/ticket/listar-todos`).pipe(
      map(tickets => tickets.map(ticket => this.fromApi(ticket)))
    );
  }

  searchTickets(id_usuario?: string, id_vehiculo?: string): Observable<Ticket[]> {
    let params = new HttpParams();
    if (id_usuario) params = params.set('id_usuario', id_usuario);
    if (id_vehiculo) params = params.set('id_vehiculo', id_vehiculo);

    return this.http.get<TicketApiResponse[]>(`${this.gatewayUrl}/ticket/buscar`, { params }).pipe(
      map(tickets => tickets.map(ticket => this.fromApi(ticket)))
    );
  }

  payTicket(ticketId: string): Observable<Ticket> {
    return this.http.post<TicketApiResponse>(`${this.gatewayUrl}/ticket/pagar/${ticketId}`, {}).pipe(
      map(ticket => this.fromApi(ticket))
    );
  }

  private fromApi(ticket: TicketApiResponse): Ticket {
    return {
      id: ticket.id_ticket,
      id_usuario: ticket.id_usuario,
      id_vehiculo: ticket.id_vehiculo,
      id_espacio: ticket.id_espacio,
      hora_ingreso: ticket.fecha_hora_ingreso,
      hora_salida: ticket.fecha_hora_salida ?? undefined,
      estado: this.normalizeStatus(ticket.estado_ticket),
      tarifa_total: ticket.valor_recaudado,
      codigo_qr: ticket.codigo_ticket
    };
  }

  private normalizeStatus(status: string): TicketStatus {
    switch (status.trim().toLowerCase()) {
      case 'pagado':
        return 'PAGADO';
      case 'cancelado':
        return 'CANCELADO';
      case 'activo':
      default:
        return 'ACTIVO';
    }
  }
}
