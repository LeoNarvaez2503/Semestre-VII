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
    const rawType = type ?? tipo ?? (data as any)?.type ?? (data as any)?.motorcycleType;

    return {
      id,
      type: this.normalizeType(rawType, data.plate),
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

    const rawType = vehicle.type ?? vehicle.motorcycleType;

    return {
      id: vehicle.vehicleId,
      type: this.normalizeType(rawType, vehicle.plate),
      data,
      created_at: vehicle.createdAt
    };
  }

  private normalizeType(type?: string, plate?: string): VehicleType {
    const raw = (type || '').trim().toLowerCase();
    if (
      raw === 'moto' ||
      raw === 'motorcycle' ||
      raw === 'scooter' ||
      raw === 'deportiva' ||
      raw === 'motocross' ||
      raw === 'custom' ||
      raw === 'cruiser'
    ) {
      return 'Moto';
    }
    if (raw === 'camioneta' || raw === 'truck') {
      return 'Camioneta';
    }
    if (raw === 'electrico' || raw === 'eléctrico') {
      return 'Electrico';
    }

    if (plate) {
      const cleanPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (/^[A-Z]{2}\d{3,4}[A-Z]?$/.test(cleanPlate)) {
        return 'Moto';
      }
    }

    return 'Auto';
  }
}
