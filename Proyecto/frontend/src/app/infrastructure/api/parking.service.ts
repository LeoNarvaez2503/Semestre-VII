import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Zone } from '../../core/models/zone.model';
import { ParkingSpace, ParkingSpaceApiResponse, SpaceStatus } from '../../core/models/space.model';

type ZonePayload = Omit<Zone, 'zoneId'>;

@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private gatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) {}

  getZones(): Observable<Zone[]> {
    return this.http.get<Zone[]>(`${this.gatewayUrl}/zona/listar`);
  }

  createZone(zone: ZonePayload): Observable<Zone> {
    return this.http.post<Zone>(`${this.gatewayUrl}/zona/crear`, zone);
  }

  updateZone(zoneId: string, zone: ZonePayload): Observable<Zone> {
    return this.http.put<Zone>(`${this.gatewayUrl}/zona/actualizar/${zoneId}`, zone);
  }

  deleteZone(zoneId: string): Observable<void> {
    return this.http.delete<void>(`${this.gatewayUrl}/zona/eliminar/${zoneId}`);
  }

  getSpaces(): Observable<ParkingSpace[]> {
    return this.http.get<ParkingSpaceApiResponse[]>(`${this.gatewayUrl}/espacio/listar`).pipe(
      map(spaces => spaces.map(space => this.fromApi(space)))
    );
  }

  getSpacesByStatus(estado: SpaceStatus): Observable<ParkingSpace[]> {
    return this.http.get<ParkingSpaceApiResponse[]>(`${this.gatewayUrl}/espacio/estado/${estado}`).pipe(
      map(spaces => spaces.map(space => this.fromApi(space)))
    );
  }

  createSpace(space: { zoneId: string; description: string; type: string; estado: string }): Observable<ParkingSpace> {
    return this.http.post<ParkingSpaceApiResponse>(`${this.gatewayUrl}/espacio/crear`, space).pipe(
      map(created => this.fromApi(created))
    );
  }

  getSpaceById(id: string): Observable<ParkingSpace> {
    return this.http.get<ParkingSpaceApiResponse>(`${this.gatewayUrl}/espacio/obtener/${id}`).pipe(
      map(space => this.fromApi(space))
    );
  }

  updateSpaceState(spaceId: string, estado: SpaceStatus, vehiculoId?: string): Observable<ParkingSpace> {
    let params = new HttpParams();
    if (vehiculoId) params = params.set('vehiculoId', vehiculoId);

    return this.http.put<ParkingSpaceApiResponse>(
      `${this.gatewayUrl}/espacio/estado/${spaceId}/estado/${estado}`,
      {},
      { params }
    ).pipe(map(space => this.fromApi(space)));
  }

  deleteSpace(spaceId: string): Observable<void> {
    return this.http.delete<void>(`${this.gatewayUrl}/espacio/eliminar/${spaceId}`);
  }

  private fromApi(space: ParkingSpaceApiResponse): ParkingSpace {
    const spaceName = space.description || space.name || space.code || space.id;
    return {
      id: space.id,
      zoneId: space.idZona,
      numero: spaceName,
      description: spaceName,
      code: space.code,
      type: space.type,
      tipo: space.type,
      estado: space.estado,
      vehiculoId: space.vehiculoId ?? undefined,
      updated_at: space.dateModified
    };
  }
}
