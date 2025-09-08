import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthDto, CreateUserDto, JwtPayloadInterface, ReadUserDto } from '@nestjs-microservices/shared';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authNatsClient: ClientProxy,
  ) { }

  async getExistingUser(createUserDto: CreateUserDto): Promise<ReadUserDto | null> {
    const user = await lastValueFrom(this.authNatsClient.send<ReadUserDto | null, CreateUserDto>('auth.check_if_exist', createUserDto));
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    const createdUserId = await lastValueFrom(this.authNatsClient.send<string, CreateUserDto>('auth.create_user', createUserDto));
    return createdUserId;
  }

  async isSessionExpired(fingerprint: string, refreshTokenId: string): Promise<{ isExpired: boolean, userId: string }> {
    const creds = await lastValueFrom(this.authNatsClient.send<{ isExpired: boolean, userId: string },
      { fingerprint: string, refreshTokenId: string }>
      ('auth.is_session_expired', { fingerprint, refreshTokenId })
    )
      .catch(err => {
        throw new HttpException(err.message, err.statusCode);
      });
    return creds;
  }

  async authenticate(userId: string, ip: string, user_agent: string, fingerprint: string): Promise<{ authCred: AuthDto, refreshTokenId: string }> {
    const creds = await lastValueFrom(this.authNatsClient.send<{ authCred: AuthDto, refreshTokenId: string },
      { userId: string, ip: string, user_agent: string, fingerprint: string }>
      ('auth.authenticate', { userId, ip, user_agent, fingerprint })
    )
      .catch(err => {
        throw new HttpException(err.message, err.statusCode);
      });
    return creds;
  }

  async validateUser(payload: JwtPayloadInterface): Promise<ReadUserDto> {
    const user = await lastValueFrom(this.authNatsClient.send<ReadUserDto, JwtPayloadInterface>('auth.validate_user', payload));
    return user;
  }

  async updateTokens(fingerprint: string, refreshTokenId: string): Promise<{ accessToken: string, refreshTokenId: string }> {
    const tokens = await lastValueFrom(this.authNatsClient.send<{ accessToken: string, refreshTokenId: string }, { fingerprint: string, refreshTokenId: string }>
      ('auth.update_tokens', { fingerprint, refreshTokenId })
    );
    return tokens;
  }


}
