import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpaceSSEMessage, SpaceStatus } from '../../core/models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpaceSseService {
  private sseUrl = environment.sseUrl;

  constructor(private zone: NgZone) {}

  getSpaceStream(): Observable<SpaceSSEMessage> {
    return new Observable<SpaceSSEMessage>(observer => {
      const eventSource = new EventSource(this.sseUrl);

      const handleEvent = (event: Event): void => {
        if (!(event instanceof MessageEvent)) return;

        this.zone.run(() => {
          const message = this.parseMessage(event.data);
          if (message) {
            observer.next(message);
          }
        });
      };

      eventSource.addEventListener('espacios', handleEvent);
      eventSource.onmessage = handleEvent;

      eventSource.onerror = (error) => {
        this.zone.run(() => {
          console.warn('SSE connection warning/error:', error);
        });
      };

      return () => {
        eventSource.removeEventListener('espacios', handleEvent);
        eventSource.close();
      };
    });
  }

  private parseMessage(rawData: unknown): SpaceSSEMessage | null {
    try {
      const parsed: unknown = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      if (!this.isRecord(parsed)) return null;

      const payload = this.isRecord(parsed['data']) ? parsed['data'] : parsed;
      const id = payload['id'];
      const estado = payload['estado'];

      if (typeof id !== 'string' || !this.isSpaceStatus(estado)) return null;

      const vehiculoId = payload['vehiculoId'];
      const zoneId = payload['zoneId'] ?? payload['idZona'];
      const timestamp = payload['timestamp'];

      return {
        id,
        estado,
        vehiculoId: typeof vehiculoId === 'string' ? vehiculoId : undefined,
        zoneId: typeof zoneId === 'string' ? zoneId : undefined,
        timestamp: typeof timestamp === 'string' ? timestamp : undefined
      };
    } catch (error) {
      console.error('Error parsing SSE event data:', error);
      return null;
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private isSpaceStatus(value: unknown): value is SpaceStatus {
    return value === 'DISPONIBLE'
      || value === 'OCUPADO'
      || value === 'RESERVADO'
      || value === 'MANTENIMIENTO';
  }
}
