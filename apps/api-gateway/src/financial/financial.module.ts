import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { FinancialController } from './financial.controller';
import { FinancialService } from './financial.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FINANCIAL_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  providers: [FinancialService],
  controllers: [FinancialController],
  exports: [FinancialService]
})
export class FinancialModule { }
