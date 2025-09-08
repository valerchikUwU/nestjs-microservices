import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReadRefreshSessionDto } from '@nestjs-microservices/shared';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_SERVICE') private readonly userNatsClient: ClientProxy,
    ) { }

    async getUserSessions(userId: string) {
        const sessions = await lastValueFrom<ReadRefreshSessionDto>(this.userNatsClient.send('session.get_user_sessions', userId)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return sessions;
    }

    async getUserById(userId: string) {
        const sessions = await lastValueFrom<ReadRefreshSessionDto>(this.userNatsClient.send('session.get_user_sessions', userId)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return sessions;
    }
}