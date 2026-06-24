import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaService } from '../services/auditoria.service.js';
import { AuditoriaAsignacion } from '../entities/auditoria.entity.js';
import { AccionAuditoria } from '../enums/accion-auditoria.enum.js';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  let repository: jest.Mocked<Repository<AuditoriaAsignacion>>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriaService,
        {
          provide: getRepositoryToken(AuditoriaAsignacion),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuditoriaService>(AuditoriaService);
    repository = module.get(getRepositoryToken(AuditoriaAsignacion));

    jest.clearAllMocks();
  });

  describe('registrar', () => {
    it('debe registrar un evento de auditoría de CREACION', async () => {
      const params = {
        userId: 'user-uuid-1',
        vehicleId: 'vehicle-uuid-1',
        accion: AccionAuditoria.CREACION,
        payload: { nuevo: { activo: true } },
      };
      const eventoCreado = {
        id: 'audit-uuid-1',
        ...params,
        timestamp: new Date(),
      };
      mockRepository.create.mockReturnValue(eventoCreado);
      mockRepository.save.mockResolvedValue(eventoCreado);

      const result = await service.registrar(params);

      expect(result).toEqual(eventoCreado);
      expect(mockRepository.create).toHaveBeenCalledWith({
        userId: params.userId,
        vehicleId: params.vehicleId,
        accion: AccionAuditoria.CREACION,
        payload: params.payload,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(eventoCreado);
    });

    it('debe registrar un evento de ELIMINACION con payload anterior vs nuevo', async () => {
      const params = {
        userId: 'user-uuid-1',
        vehicleId: 'vehicle-uuid-1',
        accion: AccionAuditoria.ELIMINACION,
        payload: {
          anterior: { activo: true, notas: 'test' },
          nuevo: { activo: false },
        },
      };
      const eventoCreado = { id: 'audit-uuid-2', ...params, timestamp: new Date() };
      mockRepository.create.mockReturnValue(eventoCreado);
      mockRepository.save.mockResolvedValue(eventoCreado);

      const result = await service.registrar(params);

      expect(result.accion).toBe(AccionAuditoria.ELIMINACION);
      expect(result.payload).toHaveProperty('anterior');
      expect(result.payload).toHaveProperty('nuevo');
    });

    it('debe manejar payload null', async () => {
      const params = {
        userId: 'user-uuid-1',
        vehicleId: 'vehicle-uuid-1',
        accion: AccionAuditoria.MODIFICACION,
      };
      const eventoCreado = { id: 'audit-uuid-3', ...params, payload: null, timestamp: new Date() };
      mockRepository.create.mockReturnValue(eventoCreado);
      mockRepository.save.mockResolvedValue(eventoCreado);

      const result = await service.registrar(params);

      expect(result.payload).toBeNull();
    });

    it('debe propagar error si el repositorio falla', async () => {
      const params = {
        userId: 'user-uuid-1',
        vehicleId: 'vehicle-uuid-1',
        accion: AccionAuditoria.CREACION,
      };
      mockRepository.create.mockReturnValue(params);
      mockRepository.save.mockRejectedValue(new Error('DB Error'));

      await expect(service.registrar(params)).rejects.toThrow('DB Error');
    });
  });

  describe('listarTodos', () => {
    it('debe retornar todos los eventos ordenados por timestamp DESC', async () => {
      const eventos = [
        { id: '1', userId: 'u1', vehicleId: 'v1', accion: AccionAuditoria.CREACION, timestamp: new Date(), payload: null },
      ];
      mockRepository.find.mockResolvedValue(eventos);

      const result = await service.listarTodos();

      expect(result).toEqual(eventos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { timestamp: 'DESC' },
      });
    });
  });

  describe('listarPorAsignacion', () => {
    it('debe retornar eventos filtrados por clave compuesta', async () => {
      const eventos = [
        { id: '1', userId: 'u1', vehicleId: 'v1', accion: AccionAuditoria.CREACION, timestamp: new Date(), payload: null },
      ];
      mockRepository.find.mockResolvedValue(eventos);

      const result = await service.listarPorAsignacion('u1', 'v1');

      expect(result).toEqual(eventos);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'u1', vehicleId: 'v1' },
        order: { timestamp: 'DESC' },
      });
    });
  });
});
