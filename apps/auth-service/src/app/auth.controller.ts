import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserDto, JwtPayloadInterface, ReadUserDto } from '@nestjs-microservices/shared';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ExceptionFilter } from '../../../../shared/src/lib/utils/exceptionFilterRpc';


@UseFilters(new ExceptionFilter())
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) { }


  @MessagePattern('auth.check_if_exist')
  async handleGetUser(@Payload() createUserDto: CreateUserDto): Promise<ReadUserDto | null> {
    const user = await this.userService.findOneUserByEmail(createUserDto.email);
    const isPasswordValid = user ?
      await this.authService.comparePassword(
        createUserDto.password,
        user.password,
      )
      : false;
    if (isPasswordValid) {
      return user;
    }
    else {
      return null
    }
  }

  @MessagePattern('auth.create_user')
  async handleCreateUser(@Payload() createUserDto: CreateUserDto): Promise<string> {
    createUserDto.password = await this.authService.hashPassword(createUserDto.password);
    const createdUserId = await this.userService.create(createUserDto);
    return createdUserId;
  }

  @MessagePattern('auth.is_session_expired')
  async handleIsSessionExpired(@Payload() data: { fingerprint: string, refreshTokenId: string }): Promise<{ isExpired: boolean, userId: string }> {
    const isLoggedResult = await this.authService.isSessionExpired(data.fingerprint, data.refreshTokenId);
    return isLoggedResult
  }

  @MessagePattern('auth.authenticate')
  async handleCreateSession(@Payload() data: { userId: string, ip: string, user_agent: string, fingerprint: string }): Promise<{ authCred: object, refreshTokenId: string }> {
    const createdSessionResult = await this.authService.authenticate(data.userId, data.ip, data.user_agent, data.fingerprint);
    return createdSessionResult;
  }

  @MessagePattern('auth.validate_user')
  async handleValidateUser(@Payload() data: JwtPayloadInterface): Promise<ReadUserDto> {
    const user = await this.userService.findOneUserById(data.id);
    return user;
  }

  @MessagePattern('auth.update_tokens')
  async handleUpdateTokens(@Payload() data: { fingerprint: string, refreshTokenId: string }): Promise<{ accessToken: string, refreshTokenId: string }> {
    const newTokens = await this.authService.updateTokens(data.fingerprint, data.refreshTokenId);
    return newTokens;
  }
}
