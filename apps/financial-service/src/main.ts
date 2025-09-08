/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { FinancialModule } from './app/financial.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(FinancialModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://nats:4222"]
      },
    });
  await app.listen();
  Logger.log('🚀 Financial microservice is listening');
}

bootstrap();
