/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { UserModule } from './app/user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, 
    {
      transport: Transport.NATS,
      options: {
        servers: ["nats://nats:4222"]
      },
    });
  await app.listen();
  Logger.log('🚀 User microservice is listening');
}

bootstrap();
