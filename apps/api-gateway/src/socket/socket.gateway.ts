// api-gateway/src/socket/socket.gateway.ts
import { Course } from '@nestjs-microservices/shared';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private clients: Map<string, Socket> = new Map();
    @WebSocketServer() ws: Server;

    afterInit(server: Server) {
        console.info(`WebSocket initialized`);
    }

    handleDisconnect(client: Socket) {
        console.info(`Client Disconnected: ${client.id}`);
        this.clients.delete(client.id);
    }

    handleConnection(client: Socket) {
        console.info(`Client Connected: ${client.id}`);
        this.clients.set(client.id, client);
        console.info(`Number of connected clients: ${this.clients.size}`);
    }

    handleBroadcastValutes(valutes: Course) {
        this.ws.emit('find_valutes', valutes)
    }
}