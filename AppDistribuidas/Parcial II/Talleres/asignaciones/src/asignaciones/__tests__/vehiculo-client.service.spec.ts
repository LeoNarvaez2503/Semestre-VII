import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { VehiculoClientService } from '../services/vehiculo-client.service.js';

// Mock global fetch
const mockFetch = jest.fn();
(global as any).fetch = mockFetch;

describe('VehiculoClientService', () => {
  let service: VehiculoClientService;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue: string) => {
      const config: Record<string, string> = {
        USUARIOS_API_URL: 'http://usuarios-api:8000',
        VEHICULOS_API_URL: 'http://vehiculos-app:3000',
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculoClientService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<VehiculoClientService>(VehiculoClientService);
    jest.clearAllMocks();
  });

  describe('validarUsuario', () => {
    it('debe retornar exists=true y active=true para un usuario válido', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ exists: true, active: true }),
      });

      const result = await service.validarUsuario('user-uuid-1');

      expect(result).toEqual({ exists: true, active: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://usuarios-api:8000/usuarios/internal/validar/user-uuid-1',
      );
    });

    it('debe retornar exists=false si el usuario no existe', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ exists: false }),
      });

      const result = await service.validarUsuario('user-inexistente');

      expect(result.exists).toBe(false);
    });

    it('debe retornar exists=false si la respuesta HTTP no es ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      const result = await service.validarUsuario('user-uuid-1');

      expect(result.exists).toBe(false);
    });

    it('debe lanzar error si la conexión falla', async () => {
      mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(service.validarUsuario('user-uuid-1')).rejects.toThrow(
        'No se pudo comunicar con el servicio de usuarios.',
      );
    });
  });

  describe('validarVehiculo', () => {
    it('debe retornar exists=true y type para un vehículo válido', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ exists: true, type: 'AUTO' }),
      });

      const result = await service.validarVehiculo('vehicle-uuid-1');

      expect(result).toEqual({ exists: true, type: 'AUTO' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://vehiculos-app:3000/vehiculos/internal/validar/vehicle-uuid-1',
      );
    });

    it('debe retornar exists=false si el vehículo no existe', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ exists: false }),
      });

      const result = await service.validarVehiculo('vehicle-inexistente');

      expect(result.exists).toBe(false);
    });

    it('debe lanzar error si la conexión falla', async () => {
      mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

      await expect(service.validarVehiculo('vehicle-uuid-1')).rejects.toThrow(
        'No se pudo comunicar con el servicio de vehículos.',
      );
    });
  });

  describe('obtenerDetalleVehiculo', () => {
    it('debe retornar el detalle completo del vehículo', async () => {
      const vehiculoDetalle = {
        id: 'vehicle-uuid-1',
        plate: 'PCG1234',
        brand: 'Chevrolet',
        model: 'Sail',
        year: 2020,
        color: 'Rojo',
        classification: 'Gasolina',
        tipo: 'auto',
      };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => vehiculoDetalle,
      });

      const result = await service.obtenerDetalleVehiculo('vehicle-uuid-1');

      expect(result).toEqual(vehiculoDetalle);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://vehiculos-app:3000/vehiculos/obtener/vehicle-uuid-1',
      );
    });

    it('debe retornar null si el vehículo no se encuentra', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await service.obtenerDetalleVehiculo('vehicle-uuid-inexistente');

      expect(result).toBeNull();
    });

    it('debe retornar null si la conexión falla', async () => {
      mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));

      const result = await service.obtenerDetalleVehiculo('vehicle-uuid-1');

      expect(result).toBeNull();
    });
  });
});
