import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValuteModule } from './app/valute.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ValuteModule, {
    transport: Transport.NATS,
    options: {
      servers: ["nats://nats:4222"]
    },
  });

  await app.listen();
  Logger.log('🚀 Valute microservice is listening (redis)');
}

bootstrap();
