import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import * as os from 'os';

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQPublisherService.name);
  private connection: any = null;
  private channel: any = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connect() {
    const host = this.configService.get<string>('RABBITMQ_HOST') || 'rabbitmq';
    const port = this.configService.get<number>('RABBITMQ_PORT') || 5672;
    const user = this.configService.get<string>('RABBITMQ_USER') || 'guest';
    const pass = this.configService.get<string>('RABBITMQ_PASSWORD') || 'guest';
    const url = `amqp://${user}:${pass}@${host}:${port}`;

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      
      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE') || 'audit_exchange';
      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      
      this.logger.log(`Successfully connected to RabbitMQ and declared exchange ${exchange}`);
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error}`);
      setTimeout(() => this.connect(), 5000); // retry
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

  async publish(routingKey: string, payload: any) {
    if (!this.channel) {
      this.logger.error('RabbitMQ channel is not available. Message not sent.');
      return;
    }

    try {
      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE') || 'audit_exchange';
      const content = Buffer.from(JSON.stringify(payload));
      
      this.channel.publish(exchange, routingKey, content, {
        persistent: true,
      });
      this.logger.debug(`Published message to ${exchange} on key ${routingKey}`);
    } catch (error) {
      this.logger.error(`Failed to publish message to RabbitMQ: ${error}`);
    }
  }

  getIpAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const dev in interfaces) {
      const iface = interfaces[dev];
      if (iface) {
        for (const details of iface) {
          if (details.family === 'IPv4' && !details.internal) {
            return details.address;
          }
        }
      }
    }
    return '127.0.0.1';
  }

  getMacAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const dev in interfaces) {
      const iface = interfaces[dev];
      if (iface) {
        for (const details of iface) {
          if (details.mac && details.mac !== '00:00:00:00:00:00' && !details.internal) {
            return details.mac;
          }
        }
      }
    }
    return '02:42:ac:11:00:02';
  }
}
