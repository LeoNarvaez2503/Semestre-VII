import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AsignacionService } from '../services/asignacion.service.js';
import { AuditoriaService } from '../services/auditoria.service.js';
import { VehiculoClientService } from '../services/vehiculo-client.service.js';
import { Asignacion } from '../entities/asignacion.entity.js';

describe('AsignacionService', () => {
  let service: AsignacionService;
  let repository: jest.Mocked<Repository<Asignacion>>;
  let vehiculoClient: jest.Mocked<VehiculoClientService>;
  let auditoriaService: jest.Mocked<AuditoriaService>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockVehiculoClient = {
    validarUsuario: jest.fn(),
    validarVehiculo: jest.fn(),
    obtenerDetalleVehiculo: jest.fn(),
  };

  const mockAuditoriaService = {
    registrar: jest.fn(),
    listarTodos: jest.fn(),
    listarPorAsignacion: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsignacionService,
        {
          provide: getRepositoryToken(Asignacion),
          useValue: mockRepository,
        },
        {
          provide: VehiculoClientService,
          useValue: mockVehiculoClient,
        },
        {
          provide: AuditoriaService,
          useValue: mockAuditoriaService,
        },
      ],
    }).compile();

    service = module.get<AsignacionService>(AsignacionService);
    repository = module.get(getRepositoryToken(Asignacion));
    vehiculoClient = module.get(VehiculoClientService);
    auditoriaService = module.get(AuditoriaService);

    jest.clearAllMocks();
  });

  describe('crear', () => {
    const createDto = {
      userId: 'user-uuid-1',
      vehicleId: 'vehicle-uuid-1',
      notas: 'Asignación de prueba',
    };

    it('debe crear una asignación exitosamente', async () => {
      mockVehiculoClient.validarUsuario.mockResolvedValue({ exists: true, active: true });
      mockVehiculoClient.validarVehiculo.mockResolvedValue({ exists: true, type: 'AUTO' });
      mockRepository.findOne.mockResolvedValue(null); // No existe asignación previa
      const asignacionCreada = {
        ...createDto,
        activo: true,
        fechaAsignacion: new Date(),
      };
      mockRepository.create.mockReturnValue(asignacionCreada);
      mockRepository.save.mockResolvedValue(asignacionCreada);
      mockAuditoriaService.registrar.mockResolvedValue(undefined);

      const result = await service.crear(createDto);

      expect(result).toEqual(asignacionCreada);
      expect(mockVehiculoClient.validarUsuario).toHaveBeenCalledWith('user-uuid-1');
      expect(mockVehiculoClient.validarVehiculo).toHaveBeenCalledWith('vehicle-uuid-1');
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditoriaService.registrar).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el usuario no existe', async () => {
      mockVehiculoClient.validarUsuario.mockResolvedValue({ exists: false });

      await expect(service.crear(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el usuario está inactivo', async () => {
      mockVehiculoClient.validarUsuario.mockResolvedValue({ exists: true, active: false });

      await expect(service.crear(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el vehículo no existe', async () => {
      mockVehiculoClient.validarUsuario.mockResolvedValue({ exists: true, active: true });
      mockVehiculoClient.validarVehiculo.mockResolvedValue({ exists: false });

      await expect(service.crear(createDto)).rejects.toThrow(BadRequestException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('debe lanzar ConflictException si el vehículo ya está asignado', async () => {
      mockVehiculoClient.validarUsuario.mockResolvedValue({ exists: true, active: true });
      mockVehiculoClient.validarVehiculo.mockResolvedValue({ exists: true, type: 'AUTO' });
      mockRepository.findOne.mockResolvedValueOnce({
        userId: 'otro-user',
        vehicleId: 'vehicle-uuid-1',
        activo: true,
      });

      await expect(service.crear(createDto)).rejects.toThrow(ConflictException);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('eliminar', () => {
    it('debe desactivar una asignación exitosamente', async () => {
      const asignacionActiva = {
        userId: 'user-uuid-1',
        vehicleId: 'vehicle-uuid-1',
        activo: true,
        notas: 'test',
        fechaAsignacion: new Date(),
      };
      mockRepository.findOne.mockResolvedValue({ ...asignacionActiva });
      mockRepository.save.mockResolvedValue({ ...asignacionActiva, activo: false });
      mockAuditoriaService.registrar.mockResolvedValue(undefined);

      const result = await service.eliminar('user-uuid-1', 'vehicle-uuid-1');

      expect(result.message).toContain('eliminada exitosamente');
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockAuditoriaService.registrar).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si no existe asignación activa', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.eliminar('user-uuid-1', 'vehicle-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerFlota', () => {
    it('debe retornar la flota enriquecida del usuario', async () => {
      const asignaciones = [
        {
          userId: 'user-uuid-1',
          vehicleId: 'vehicle-uuid-1',
          activo: true,
          fechaAsignacion: new Date('2026-06-24'),
        },
      ];
      mockRepository.find.mockResolvedValue(asignaciones);
      mockVehiculoClient.obtenerDetalleVehiculo.mockResolvedValue({
        id: 'vehicle-uuid-1',
        plate: 'PCG1234',
        brand: 'Chevrolet',
        model: 'Sail',
        year: 2020,
        color: 'Rojo',
        classification: 'Gasolina',
        tipo: 'auto',
      });

      const result = await service.obtenerFlota('user-uuid-1');

      expect(result.userId).toBe('user-uuid-1');
      expect(result.totalVehiculos).toBe(1);
      expect(result.vehiculos[0].placa).toBe('PCG1234');
      expect(result.vehiculos[0].tipo).toBe('AUTO');
    });

    it('debe retornar flota vacía si el usuario no tiene asignaciones', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.obtenerFlota('user-uuid-1');

      expect(result.totalVehiculos).toBe(0);
      expect(result.vehiculos).toEqual([]);
    });

    it('debe tolerar fallas parciales al obtener detalle de vehículos', async () => {
      const asignaciones = [
        { userId: 'user-1', vehicleId: 'v-1', activo: true, fechaAsignacion: new Date() },
        { userId: 'user-1', vehicleId: 'v-2', activo: true, fechaAsignacion: new Date() },
      ];
      mockRepository.find.mockResolvedValue(asignaciones);
      mockVehiculoClient.obtenerDetalleVehiculo
        .mockResolvedValueOnce({
          id: 'v-1', plate: 'AAA1111', brand: 'Toyota', model: 'Corolla',
          year: 2022, color: 'Blanco', classification: 'Hibrido', tipo: 'auto',
        })
        .mockResolvedValueOnce(null); // segundo vehículo no disponible

      const result = await service.obtenerFlota('user-1');

      expect(result.totalVehiculos).toBe(1);
      expect(result.vehiculos[0].placa).toBe('AAA1111');
    });
  });

  describe('listarTodas', () => {
    it('debe retornar todas las asignaciones', async () => {
      const asignaciones = [
        { userId: 'u1', vehicleId: 'v1', activo: true, fechaAsignacion: new Date(), notas: null },
      ];
      mockRepository.find.mockResolvedValue(asignaciones);

      const result = await service.listarTodas();

      expect(result).toEqual(asignaciones);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { fechaAsignacion: 'DESC' },
      });
    });
  });
});
