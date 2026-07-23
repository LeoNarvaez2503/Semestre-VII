import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Assignment,
  AssignmentTrace,
  CreateAssignmentRequest,
  UpdateAssignmentRequest
} from '../../core/models/assignment.model';

@Injectable({ providedIn: 'root' })
export class AssignmentService {
  private readonly http = inject(HttpClient);
  private readonly gatewayUrl = environment.gatewayUrl;

  createAssignment(request: CreateAssignmentRequest): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.gatewayUrl}/asignacion/crear`, request);
  }

  updateAssignment(
    userId: string,
    vehicleId: string,
    request: UpdateAssignmentRequest
  ): Observable<Assignment> {
    return this.http.put<Assignment>(
      `${this.gatewayUrl}/asignacion/actualizar/${encodeURIComponent(userId)}/${encodeURIComponent(vehicleId)}`,
      request
    );
  }

  deleteAssignment(userId: string, vehicleId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.gatewayUrl}/asignacion/eliminar/${encodeURIComponent(userId)}/${encodeURIComponent(vehicleId)}`
    );
  }

  getTraceability(): Observable<AssignmentTrace[]> {
    return this.http.get<AssignmentTrace[]>(`${this.gatewayUrl}/asignacion/trazabilidad`);
  }

  getFleetByOwner(propietarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/asignacion/propietario/${encodeURIComponent(propietarioId)}`);
  }
}
