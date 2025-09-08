import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketController } from './socket.controller';

@Module({
  imports: [
  ],
  controllers: [SocketController],
  providers: [SocketGateway],
})
export class SocketModule {}
