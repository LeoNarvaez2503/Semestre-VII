import { Test, TestingModule } from '@nestjs/testing';
import { AsignacionService } from './asignacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Asignacion } from '../entities/asignacion.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';

describe('AsignacionService', () => {
  let service: AsignacionService;
  let mockFetch: jest.SpyInstance;

  const mockAsignacionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key, defaultValue) => defaultValue || 'http://localhost'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsignacionService,
        {
          provide: getRepositoryToken(Asignacion),
          useValue: mockAsignacionRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AsignacionService>(AsignacionService);
    mockFetch = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an assignment successfully if validation passes and vehicle is not assigned', async () => {
      // Mock user validation response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true, active: true }),
      } as any);

      // Mock vehicle validation response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true }),
      } as any);

      mockAsignacionRepository.findOne.mockResolvedValueOnce(null); // No other owner assigned
      mockAsignacionRepository.findOne.mockResolvedValueOnce(null); // Not existing assignment for this owner
      
      const newAssign = { userId: 'user-uuid', vehicleId: 'vehicle-uuid', active: true };
      mockAsignacionRepository.create.mockReturnValue(newAssign);
      mockAsignacionRepository.save.mockResolvedValue(newAssign);

      const result = await service.create({ userId: 'user-uuid', vehicleId: 'vehicle-uuid' });
      expect(result).toEqual(newAssign);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException if vehicle is already actively assigned to another user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true, active: true }),
      } as any);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true }),
      } as any);

      // Already assigned to someone else
      mockAsignacionRepository.findOne.mockResolvedValueOnce({
        userId: 'other-user',
        vehicleId: 'vehicle-uuid',
        active: true,
      });

      await expect(
        service.create({ userId: 'user-uuid', vehicleId: 'vehicle-uuid' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reactivate an inactive assignment if it exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true, active: true }),
      } as any);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ exists: true }),
      } as any);

      mockAsignacionRepository.findOne.mockResolvedValueOnce(null); // No other owner assigned
      
      const inactiveAssign = { userId: 'user-uuid', vehicleId: 'vehicle-uuid', active: false };
      mockAsignacionRepository.findOne.mockResolvedValueOnce(inactiveAssign); // Exists but inactive

      mockAsignacionRepository.save.mockImplementation(async (val) => val);

      const result = await service.create({ userId: 'user-uuid', vehicleId: 'vehicle-uuid' });
      expect(result.active).toBe(true);
    });
  });

  describe('getFleetByOwner', () => {
    it('should retrieve and enrich owner fleet from vehicle-app details', async () => {
      mockAsignacionRepository.find.mockResolvedValue([{ userId: 'owner-uuid', vehicleId: 'v1', active: true }]);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          plate: 'PDF9876',
          brand: 'Toyota',
          model: 'Yaris',
          color: 'Gris',
          year: 2022,
          tipo: 'auto',
          classification: 'Gasolina',
        }),
      } as any);

      const fleet = await service.getFleetByOwner('owner-uuid');
      expect(fleet).toHaveLength(1);
      expect(fleet[0]).toEqual({
        userId: 'owner-uuid',
        vehicleId: 'v1',
        plate: 'PDF9876',
        brand: 'Toyota',
        model: 'Yaris',
        color: 'Gris',
        year: 2022,
        type: 'Automóvil',
        category: 'Combustión',
        active: true,
        createdAt: undefined,
      });
    });
  });
});
