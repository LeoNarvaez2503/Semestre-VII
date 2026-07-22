import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQPublisherService } from './rabbitmq.service';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';
import { SseModule } from '../sse/sse.module';

@Global()
@Module({
  imports: [ConfigModule, SseModule],
  providers: [RabbitMQPublisherService, RabbitMQConsumerService],
  exports: [RabbitMQPublisherService, RabbitMQConsumerService],
})
export class RabbitMQModule {}
