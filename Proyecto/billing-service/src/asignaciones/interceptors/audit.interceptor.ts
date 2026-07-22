import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asignacion } from '../entities/asignacion.entity';
import { Auditoria } from '../entities/auditoria.entity';
import { RabbitMQPublisherService } from '../../rabbitmq/rabbitmq.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Asignacion)
    private readonly asignacionRepository: Repository<Asignacion>,
    @InjectRepository(Auditoria)
    private readonly auditoriaRepository: Repository<Auditoria>,
    private readonly rabbitmqService: RabbitMQPublisherService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const params = request.params;
    const body = request.body;

    let previousState: any = null;
    let userId: string | null = null;
    let vehicleId: string | null = null;
    let tipoAccion: string | null = null;

    if (method === 'POST') {
      tipoAccion = 'CREACION';
      userId = body.userId;
      vehicleId = body.vehicleId;
    } else if (method === 'PUT' || method === 'PATCH') {
      tipoAccion = 'MODIFICACION';
      userId = params.userId;
      vehicleId = params.vehicleId;
    } else if (method === 'DELETE') {
      tipoAccion = 'ELIMINACION';
      userId = params.userId;
      vehicleId = params.vehicleId;
    }

    // Fetch previous state if modifying or deleting
    if (
      tipoAccion &&
      (tipoAccion === 'MODIFICACION' || tipoAccion === 'ELIMINACION') &&
      userId &&
      vehicleId
    ) {
      try {
        const found = await this.asignacionRepository.findOne({
          where: { userId, vehicleId },
        });
        if (found) {
          previousState = { ...found };
        }
      } catch (e) {
        // Silently catch database errors during pre-fetch
      }
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          if (!tipoAccion) return;

          // Extract IDs from returned data if not captured initially
          if (tipoAccion === 'CREACION' && data) {
            userId = userId || data.userId;
            vehicleId = vehicleId || data.vehicleId;
          }

          const newState = tipoAccion === 'ELIMINACION' ? null : (data ? { ...data } : null);

          if (userId && vehicleId) {
            try {
              const audit = new Auditoria();
              audit.userId = userId;
              audit.vehicleId = vehicleId;
              audit.tipoAccion = tipoAccion;
              audit.payload = {
                previousState,
                newState,
              };
              await this.auditoriaRepository.save(audit);
            } catch (auditError) {
              console.error('Error saving audit log:', auditError);
            }

            try {
              let actionMapped = 'CREATE';
              if (tipoAccion === 'MODIFICACION') actionMapped = 'UPDATE';
              if (tipoAccion === 'ELIMINACION') actionMapped = 'DELETE';

              const username = request.user?.username || 'anonymous';
              const ip = this.rabbitmqService.getIpAddress();
              const mac = this.rabbitmqService.getMacAddress();

              await this.rabbitmqService.publish('audit.assignments', {
                servicio: 'ms-assignments',
                accion: actionMapped,
                entidad: 'ASIGNACION',
                datos: {
                  userId,
                  vehicleId,
                  previousState,
                  newState
                },
                usuario: username,
                ip,
                mac
              });
            } catch (rabbitError) {
              console.error('Error publishing audit log to RabbitMQ:', rabbitError);
            }
          }
        },
      }),
    );
  }
}
