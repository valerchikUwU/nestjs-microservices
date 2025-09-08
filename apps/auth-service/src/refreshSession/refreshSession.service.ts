import { CreateRefreshSessionDto, ReadRefreshSessionDto } from "@nestjs-microservices/shared";
import { HttpException, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

export class RefreshSessionService {
    constructor(
        @Inject('SESSION_SERVICE') private readonly sessionNatsService: ClientProxy
    ) { }


    async findOneByIdAndFingerprint(fingerprint: string, refreshTokenId: string): Promise<ReadRefreshSessionDto> {
        const session = await lastValueFrom<ReadRefreshSessionDto>(
            this.sessionNatsService.send<ReadRefreshSessionDto,
                { fingerprint: string, refreshTokenId: string }>
                ('session.find_by_id_fingerprint', { fingerprint: fingerprint, refreshTokenId: refreshTokenId })
        ).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return session;
    }


    async create(createRefreshSessionDto: CreateRefreshSessionDto): Promise<string> {
        const createdSessionId = await lastValueFrom<string>(
            this.sessionNatsService.send<string, CreateRefreshSessionDto>
                ('session.create_refreshSession', createRefreshSessionDto)
        );
        return createdSessionId;
    }

    async remove(refreshTokenId: string): Promise<boolean> {
        const isRemoved = await lastValueFrom<boolean>(this.sessionNatsService.send<boolean, string>('session.remove_by_id', refreshTokenId)).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return isRemoved
    }
}