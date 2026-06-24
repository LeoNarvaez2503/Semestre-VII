import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ValidacionUsuario {
  exists: boolean;
  active?: boolean;
}

export interface ValidacionVehiculo {
  exists: boolean;
  type?: string;
}

export interface DetalleVehiculo {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  classification: string;
  tipo: string;
  [key: string]: any;
}

@Injectable()
export class VehiculoClientService {
  private readonly logger = new Logger(VehiculoClientService.name);
  private readonly usuariosApiUrl: string;
  private readonly vehiculosApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.usuariosApiUrl = this.configService.get<string>('USUARIOS_API_URL', 'http://usuarios-api:8000');
    this.vehiculosApiUrl = this.configService.get<string>('VEHICULOS_API_URL', 'http://vehiculos-app:3000');
  }

  /**
   * Valida que un usuario exista y esté activo en el microservicio de usuarios.
   */
  async validarUsuario(userId: string): Promise<ValidacionUsuario> {
    try {
      const response = await fetch(`${this.usuariosApiUrl}/usuarios/internal/validar/${userId}`);
      if (!response.ok) {
        this.logger.error(`Error al validar usuario ${userId}: HTTP ${response.status}`);
        return { exists: false };
      }
      return await response.json() as ValidacionUsuario;
    } catch (error) {
      this.logger.error(`No se pudo conectar con el servicio de usuarios: ${error}`);
      throw new Error('No se pudo comunicar con el servicio de usuarios.');
    }
  }

  /**
   * Valida que un vehículo exista en el microservicio de vehículos.
   */
  async validarVehiculo(vehicleId: string): Promise<ValidacionVehiculo> {
    try {
      const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/internal/validar/${vehicleId}`);
      if (!response.ok) {
        this.logger.error(`Error al validar vehículo ${vehicleId}: HTTP ${response.status}`);
        return { exists: false };
      }
      return await response.json() as ValidacionVehiculo;
    } catch (error) {
      this.logger.error(`No se pudo conectar con el servicio de vehículos: ${error}`);
      throw new Error('No se pudo comunicar con el servicio de vehículos.');
    }
  }

  /**
   * Obtiene el detalle completo de un vehículo para la consulta de flota (RF3).
   */
  async obtenerDetalleVehiculo(vehicleId: string): Promise<DetalleVehiculo | null> {
    try {
      const response = await fetch(`${this.vehiculosApiUrl}/vehiculos/obtener/${vehicleId}`);
      if (!response.ok) {
        this.logger.warn(`Vehículo ${vehicleId} no encontrado en el servicio de vehículos: HTTP ${response.status}`);
        return null;
      }
      return await response.json() as DetalleVehiculo;
    } catch (error) {
      this.logger.error(`Error al obtener detalle del vehículo ${vehicleId}: ${error}`);
      return null;
    }
  }
}
