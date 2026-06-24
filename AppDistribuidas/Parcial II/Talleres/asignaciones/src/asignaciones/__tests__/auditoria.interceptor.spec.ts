import { AuditoriaInterceptor } from '../interceptors/auditoria.interceptor.js';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('AuditoriaInterceptor', () => {
  let interceptor: AuditoriaInterceptor;

  beforeEach(() => {
    interceptor = new AuditoriaInterceptor();
  });

  const createMockContext = (method: string, url: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ method, url }),
        getResponse: () => ({}),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as unknown as ExecutionContext;
  };

  const createMockCallHandler = (returnValue: any): CallHandler => ({
    handle: () => of(returnValue),
  });

  const createErrorCallHandler = (error: Error): CallHandler => ({
    handle: () => throwError(() => error),
  });

  it('debe ser definido', () => {
    expect(interceptor).toBeDefined();
  });

  it('debe interceptar peticiones POST exitosamente', (done) => {
    const context = createMockContext('POST', '/asignaciones/crear');
    const handler = createMockCallHandler({ userId: 'u1', vehicleId: 'v1' });

    interceptor.intercept(context, handler).subscribe({
      next: (value) => {
        expect(value).toEqual({ userId: 'u1', vehicleId: 'v1' });
      },
      complete: () => done(),
    });
  });

  it('debe interceptar peticiones DELETE exitosamente', (done) => {
    const context = createMockContext('DELETE', '/asignaciones/eliminar/u1/v1');
    const handler = createMockCallHandler({ message: 'eliminada' });

    interceptor.intercept(context, handler).subscribe({
      next: (value) => {
        expect(value).toEqual({ message: 'eliminada' });
      },
      complete: () => done(),
    });
  });

  it('debe interceptar peticiones PATCH exitosamente', (done) => {
    const context = createMockContext('PATCH', '/asignaciones/actualizar');
    const handler = createMockCallHandler({ userId: 'u2', vehicleId: 'v1' });

    interceptor.intercept(context, handler).subscribe({
      next: (value) => {
        expect(value).toEqual({ userId: 'u2', vehicleId: 'v1' });
      },
      complete: () => done(),
    });
  });

  it('debe permitir peticiones GET sin error', (done) => {
    const context = createMockContext('GET', '/asignaciones/listar');
    const handler = createMockCallHandler([{ userId: 'u1' }]);

    interceptor.intercept(context, handler).subscribe({
      next: (value) => {
        expect(value).toEqual([{ userId: 'u1' }]);
      },
      complete: () => done(),
    });
  });

  it('debe manejar errores del handler', (done) => {
    const context = createMockContext('POST', '/asignaciones/crear');
    const handler = createErrorCallHandler(new Error('Test error'));

    interceptor.intercept(context, handler).subscribe({
      error: (err) => {
        expect(err.message).toBe('Test error');
        done();
      },
    });
  });
});
