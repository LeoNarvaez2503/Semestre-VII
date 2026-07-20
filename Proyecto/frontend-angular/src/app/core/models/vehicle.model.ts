export type VehicleType = 'Auto' | 'Moto' | 'Camioneta' | 'Electrico';

export interface VehicleData {
  plate: string;
  brand: string;
  model: string;
  color: string;
  year?: number;
  classification?: string;
  doors?: number;
  fuelType?: string;
  trunkCapacity?: number;
  cylinderCapacity?: number;
  cabin?: number;
  loadCapacity?: number;
  motorcycleType?: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  data: VehicleData;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleApiResponse extends VehicleData {
  id: string;
  type?: string;
  tipo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleFleetApiResponse extends Partial<VehicleData> {
  vehicleId: string;
  type?: string;
  category?: string;
  createdAt?: string;
  error?: string;
}

export interface VehicleWritePayload {
  type: string;
  data: Partial<VehicleData>;
}
