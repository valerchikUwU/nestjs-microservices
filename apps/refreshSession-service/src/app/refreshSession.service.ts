import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RefreshSessionRepository } from './refreshSession.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRefreshSessionDto, ReadRefreshSessionDto, RefreshSession, RpcInternalServerException, RpcNotFoundException } from '@nestjs-microservices/shared';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private sessionsRepository: RefreshSessionRepository,
  ) { }

  async findAllByUserId(userId: string): Promise<ReadRefreshSessionDto[]> {
    try {
      const sessions = await this.sessionsRepository.findBy({ userId: userId });
      const sessionsDto: ReadRefreshSessionDto[] = plainToInstance(ReadRefreshSessionDto, sessions);
      return sessionsDto;
    } catch (err) {
      throw new RpcNotFoundException('Ошибка при получении всех cессий!');
    }
  }

  async create(createSessionDto: CreateRefreshSessionDto): Promise<string> {
    try {
      const session = plainToInstance(RefreshSession, createSessionDto)
      const refreshSession = await this.sessionsRepository.insert(session);
      // await this.cacheService.set<RefreshSession>(
      //   `session:${refreshSession.id}`,
      //   refreshSession,
      //   1860000,
      // );
      return refreshSession.identifiers[0].id;
    } catch (err) {
      console.log(err);
      throw new RpcInternalServerException('Ошибка при создании сессии!');
    }
  }

  async findOneByIdAndFingerprint(
    id: string,
    fingerprint: string,
  ): Promise<ReadRefreshSessionDto | null> {
    try {
      const session = await this.sessionsRepository.findOneBy({ id: id, fingerprint: fingerprint });
      if (!session) return null;
      const readRefreshSessionDto: ReadRefreshSessionDto = plainToInstance(ReadRefreshSessionDto, session)
      return readRefreshSessionDto;
    } catch (err) {
      throw new RpcInternalServerException('Ошибка при получении сессии');
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.sessionsRepository.delete(id);
      return true;
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка при удалении сессии');
    }
  }

  async updateRefreshTokenById(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      const session = await this.sessionsRepository.findOneBy({ id });
      if (!session)
        throw new RpcNotFoundException(`Сессия с ID: ${id} не найдена`);
      await this.sessionsRepository.update(id, {
        refreshToken: refreshToken,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }

      throw new RpcInternalServerException('Ошибка при обновлении сессии');
    }
  }
}
