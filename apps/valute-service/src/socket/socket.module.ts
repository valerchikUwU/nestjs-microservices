import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocketService } from './socket.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SOCKET_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      },
    ]),
  ],
  providers: [SocketService],
  controllers: [],
  exports: [SocketService]
})
export class SocketModule { }
