import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ValuteController } from './valute.controller';
import { ValuteService } from './valute.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'VALUTE_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  providers: [ValuteService],
  controllers: [ValuteController],
  exports: [ValuteService]
})
export class ValuteModule { }
