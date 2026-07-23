import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditEvent } from '../../core/models/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private gatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) {}

  getAuditLogs(): Observable<AuditEvent[]> {
    return this.http.get<AuditEvent[]>(`${this.gatewayUrl}/notifications/audit`);
  }

  getAuditLogById(id: string): Observable<AuditEvent> {
    return this.http.get<AuditEvent>(`${this.gatewayUrl}/notifications/audit/${id}`);
  }
}
