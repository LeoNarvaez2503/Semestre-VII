export interface Assignment {
  userId: string;
  vehicleId: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignmentRequest {
  userId: string;
  vehicleId: string;
}

export interface UpdateAssignmentRequest {
  active: boolean;
}

export interface AssignmentAuditPayload {
  previousState: Assignment | null;
  newState: Assignment | null;
}

export interface AssignmentTrace {
  id: string;
  userId: string;
  vehicleId: string;
  tipoAccion: 'CREACION' | 'MODIFICACION' | 'ELIMINACION' | string;
  timestamp: string;
  payload: AssignmentAuditPayload;
}
