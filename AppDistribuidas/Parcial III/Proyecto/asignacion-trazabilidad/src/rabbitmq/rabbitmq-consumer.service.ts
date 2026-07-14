import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { SseService } from '../sse/sse.service';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQConsumerService.name);
  private connection: any = null;
  private channel: any = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly sseService: SseService,
  ) {}

  async onModuleInit() {
    await this.connectAndSubscribe();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connectAndSubscribe() {
    const host = this.configService.get<string>('RABBITMQ_HOST') || 'rabbitmq';
    const port = this.configService.get<number>('RABBITMQ_PORT') || 5672;
    const user = this.configService.get<string>('RABBITMQ_USER') || 'guest';
    const pass = this.configService.get<string>('RABBITMQ_PASSWORD') || 'guest';
    const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE') || 'audit_exchange';
    const url = `amqp://${user}:${pass}@${host}:${port}`;

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(exchange, 'topic', { durable: true });

      // Create a transient, exclusive queue for SSE updates so multiple replicas can listen if needed
      const q = await this.channel.assertQueue('', { exclusive: true, autoDelete: true });
      
      // Bind to exchange to get all audit.zones events
      await this.channel.bindQueue(q.queue, exchange, 'audit.zones');
      // Also bind to audit.# just in case
      await this.channel.bindQueue(q.queue, exchange, 'audit.#');

      this.logger.log(`RabbitMQ Consumer bound to exchange ${exchange} on queue ${q.queue}`);

      await this.channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          try {
            const content = msg.content.toString();
            const payload = JSON.parse(content);
            this.logger.log(`Evento de auditoría recibido: ${payload.entidad} - ${payload.accion}`);

            if (payload.entidad === 'ESPACIO') {
              this.logger.log(`Enviando evento SSE de espacio a clientes`);
              this.sseService.emitEvent('espacios', payload.datos);
            }
          } catch (err) {
            this.logger.error(`Error parsing message: ${err}`);
          }
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to connect/subscribe to RabbitMQ: ${error}`);
      setTimeout(() => this.connectAndSubscribe(), 5000); // retry
    }
  }

  private async close() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (error) {
      this.logger.error(`Error closing RabbitMQ connection: ${error}`);
    }
  }
}
