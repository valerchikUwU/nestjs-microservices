import { Controller, UseFilters } from '@nestjs/common';

import { RefreshSessionService } from './refreshSession.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRefreshSessionDto, ReadRefreshSessionDto } from '@nestjs-microservices/shared';
import { ExceptionFilter } from '../../../../shared/src/lib/utils/exceptionFilterRpc';


@UseFilters(new ExceptionFilter())
@Controller()
export class RefreshSessionController {
  constructor(private readonly refreshSessionService: RefreshSessionService) { }

  @MessagePattern('session.create_refreshSession')
  async handleCreateSession(@Payload() createRefreshSessionDto: CreateRefreshSessionDto): Promise<string> {
    const createdRefreshSessionId = await this.refreshSessionService.create(createRefreshSessionDto);
    return createdRefreshSessionId;
  }

  @MessagePattern('session.find_by_id_fingerprint')
  async handleGetSession(@Payload() data: { fingerprint: string, refreshTokenId: string }) {
    const session = await this.refreshSessionService.findOneByIdAndFingerprint(data.fingerprint, data.refreshTokenId);
    return session;
  }

  @MessagePattern('session.remove_by_id')
  async handleRemoveSession(@Payload() refreshTokenId: string): Promise<boolean> {
    return await this.refreshSessionService.remove(refreshTokenId);
  }

  @MessagePattern('session.get_user_sessions')
  async handleGetUserSessions(@Payload() userId: string): Promise<ReadRefreshSessionDto[]> {
    const sessions = await this.refreshSessionService.findAllByUserId(userId);
    return sessions;
  }
}
