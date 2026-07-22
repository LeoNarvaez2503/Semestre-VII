import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQPublisherService } from './rabbitmq.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RabbitMQPublisherService],
  exports: [RabbitMQPublisherService],
})
export class RabbitMQModule {}
