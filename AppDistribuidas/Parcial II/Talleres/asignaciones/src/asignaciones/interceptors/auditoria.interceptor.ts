import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor AOP para logging de operaciones de asignación.
 * Registra en consola las operaciones de mutación (POST, PATCH, DELETE).
 * La auditoría real a la base de datos se maneja directamente en AsignacionService
 * para garantizar la integridad de los datos de payload.
 */
@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditoriaInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseData) => {
          const duration = Date.now() - now;

          if (['POST', 'PATCH', 'DELETE'].includes(method)) {
            this.logger.log(
              `[${method}] ${url} — ${duration}ms — Operación de asignación completada exitosamente`,
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - now;
          this.logger.warn(
            `[${method}] ${url} — ${duration}ms — Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
