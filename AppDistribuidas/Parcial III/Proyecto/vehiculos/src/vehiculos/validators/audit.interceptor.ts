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
import Vehicle from '../entities/vehicle.entity';
import { RabbitMQPublisherService } from '../../rabbitmq/rabbitmq.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly rabbitmqService: RabbitMQPublisherService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const params = request.params;
    const body = request.body;

    let previousState: any = null;
    let vehicleId: string | null = null;
    let actionMapped: string | null = null;

    if (method === 'POST') {
      actionMapped = 'CREATE';
    } else if (method === 'PUT' || method === 'PATCH') {
      actionMapped = 'UPDATE';
      vehicleId = params.id;
    } else if (method === 'DELETE') {
      actionMapped = 'DELETE';
      vehicleId = params.id;
    }

    // Fetch previous state if updating or deleting
    if (actionMapped && (actionMapped === 'UPDATE' || actionMapped === 'DELETE') && vehicleId) {
      try {
        const found = await this.vehicleRepository.findOne({
          where: { id: vehicleId },
        });
        if (found) {
          previousState = { ...found };
        }
      } catch (e) {
        // ignore errors
      }
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          if (!actionMapped) return;

          const newState = actionMapped === 'DELETE' ? null : (data ? { ...data } : null);
          const finalVehicleId = vehicleId || (data ? data.id : null);

          try {
            const username = request.user?.username || 'anonymous';
            const ip = this.rabbitmqService.getIpAddress();
            const mac = this.rabbitmqService.getMacAddress();

            await this.rabbitmqService.publish('audit.vehicles', {
              servicio: 'ms-vehicles',
              accion: actionMapped,
              entidad: 'VEHICULO',
              datos: {
                id: finalVehicleId,
                previousState,
                newState
              },
              usuario: username,
              ip,
              mac
            });
          } catch (rabbitError) {
            console.error('Error publishing vehicle audit log to RabbitMQ:', rabbitError);
          }
        },
      }),
    );
  }
}
