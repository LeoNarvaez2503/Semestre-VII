import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Vehicle,
  VehicleApiResponse,
  VehicleData,
  VehicleFleetApiResponse,
  VehicleType,
  VehicleWritePayload
} from '../../core/models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private gatewayUrl = environment.gatewayUrl;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleApiResponse[]>(`${this.gatewayUrl}/vehiculo/listar`).pipe(
      map(vehicles => vehicles.map(vehicle => this.fromApi(vehicle)))
    );
  }

  getMyVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleFleetApiResponse[]>(`${this.gatewayUrl}/usuario/me/vehiculos`).pipe(
      map(vehicles => vehicles.map(vehicle => this.fromFleetApi(vehicle)))
    );
  }

  createVehicle(vehicle: VehicleWritePayload): Observable<Vehicle> {
    return this.http.post<VehicleApiResponse>(`${this.gatewayUrl}/vehiculo/crear`, this.toApiPayload(vehicle)).pipe(
      map(created => this.fromApi(created))
    );
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<VehicleApiResponse>(`${this.gatewayUrl}/vehiculo/obtener/${id}`).pipe(
      map(vehicle => this.fromApi(vehicle))
    );
  }

  updateVehicle(id: string, data: VehicleWritePayload): Observable<Vehicle> {
    return this.http.patch<VehicleApiResponse>(`${this.gatewayUrl}/vehiculo/actualizar/${id}`, this.toApiPayload(data)).pipe(
      map(vehicle => this.fromApi(vehicle))
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.gatewayUrl}/vehiculo/eliminar/${id}`);
  }

  private toApiPayload(vehicle: VehicleWritePayload): Record<string, unknown> {
    const data: Record<string, unknown> = { ...vehicle.data };
    if (vehicle.type === 'Moto') {
      data['type'] = vehicle.data.motorcycleType;
      delete data['motorcycleType'];
    }
    return { type: vehicle.type, data };
  }

  private fromApi(vehicle: VehicleApiResponse): Vehicle {
    const { id, type, tipo, created_at, updated_at, ...data } = vehicle;

    return {
      id,
      type: this.normalizeType(type ?? tipo),
      data,
      created_at,
      updated_at
    };
  }

  private fromFleetApi(vehicle: VehicleFleetApiResponse): Vehicle {
    const data: VehicleData = {
      plate: vehicle.plate ?? '',
      brand: vehicle.brand ?? '',
      model: vehicle.model ?? '',
      color: vehicle.color ?? '',
      year: vehicle.year,
      classification: vehicle.classification ?? vehicle.category,
      doors: vehicle.doors,
      fuelType: vehicle.fuelType,
      trunkCapacity: vehicle.trunkCapacity,
      cylinderCapacity: vehicle.cylinderCapacity,
      cabin: vehicle.cabin,
      loadCapacity: vehicle.loadCapacity,
      motorcycleType: vehicle.motorcycleType
    };

    return {
      id: vehicle.vehicleId,
      type: this.normalizeType(vehicle.type),
      data,
      created_at: vehicle.createdAt
    };
  }

  private normalizeType(type?: string): VehicleType {
    switch (type?.trim().toLowerCase()) {
      case 'moto':
        return 'Moto';
      case 'camioneta':
        return 'Camioneta';
      case 'electrico':
      case 'eléctrico':
        return 'Electrico';
      case 'automóvil':
      case 'automovil':
      case 'auto':
      default:
        return 'Auto';
    }
  }
}
