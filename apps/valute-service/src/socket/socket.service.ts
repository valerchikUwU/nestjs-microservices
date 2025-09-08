import { Course } from "@nestjs-microservices/shared";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

export class SocketService {
    constructor(
        @Inject('SOCKET_SERVICE') private readonly socketNatsService: ClientProxy,
    ) { }

    async emitValutes(valutes: Course): Promise<void> {
        this.socketNatsService.emit('socket.find_valutes', valutes);
        console.log('emitted')
    }
}