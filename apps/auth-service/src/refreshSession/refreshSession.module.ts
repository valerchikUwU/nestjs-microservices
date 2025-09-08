import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RefreshSessionService } from './refreshSession.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SESSION_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  providers: [RefreshSessionService],
  controllers: [],
  exports: [RefreshSessionService]
})
export class RefreshSessionModule { }
