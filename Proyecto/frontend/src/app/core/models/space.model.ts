export type SpaceStatus = 'DISPONIBLE' | 'OCUPADO' | 'RESERVADO' | 'MANTENIMIENTO';
export type SpaceVehicleType = 'AUTO' | 'MOTO' | 'BUSETA' | 'CAMIONETA' | 'ELECTRICO';

export interface ParkingSpace {
  id: string;
  zoneId: string;
  numero?: string;
  description: string;
  type: SpaceVehicleType;
  tipo?: string;
  estado: SpaceStatus;
  vehiculoId?: string;
  updated_at?: string;
}

export interface ParkingSpaceApiResponse {
  id: string;
  idZona: string;
  name?: string;
  code?: string;
  description?: string;
  type: SpaceVehicleType;
  estado: SpaceStatus;
  vehiculoId?: string | null;
  dateModified?: string;
}

export interface SpaceSSEMessage {
  id: string;
  estado: SpaceStatus;
  vehiculoId?: string;
  zoneId?: string;
  timestamp?: string;
}

export interface SpaceSSEEnvelope {
  type: string;
  data: SpaceSSEMessage & { idZona?: string };
}
