import { Controller } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Course } from '@nestjs-microservices/shared';

@Controller()
export class SocketController {
    constructor(
        private readonly socketGateway: SocketGateway,
    ) { }

    @EventPattern('socket.find_valutes')
    handleRecieveValutes(@Payload() valutes: Course) {
        this.socketGateway.handleBroadcastValutes(valutes)
    }
}
