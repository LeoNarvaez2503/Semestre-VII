export interface Zone {
  zoneId: string;
  name: string;
  description: string;
  type: string;
  capacidad: number;
  code?: string;
  status?: number;
  dateCreated?: string;
  dateModified?: string;
}
