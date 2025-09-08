import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
  Req,
  Headers,
  Query,
  Res,
  Ip,
} from '@nestjs/common';
import { CreateUserDto } from '@nestjs-microservices/shared';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import { Response as ExpressResponse } from 'express';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get('signin')
  async findInitCredentials(
    @Req() req: ExpressRequest,
    @Query('fingerprint') fingerprint?: string,
  ): Promise<object> {
    let isLogged = false;
    let userId = null;
    const refreshTokenId = req.cookies?.refreshTokenId;
    if (fingerprint && refreshTokenId) {
      const isLoggedResult = await this.authService.isSessionExpired(
        fingerprint,
        refreshTokenId,
      );
      isLogged = !isLoggedResult.isExpired;
      userId = isLogged ? isLoggedResult.userId : null;
    }
    return {
      isLogged,
      userId,
    };
  }

  @Post('login')
  // @UseGuards(AccessTokenGuard)
  async login(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Headers('User-Agent') user_agent: string,
    @Query('fingerprint') fingerprint: string,
    @Res() res: ExpressResponse
  ) {
    const user = await this.authService.getExistingUser(createUserDto);

    if (user) {
      const authenticateResult = await this.authService.authenticate(user.id, ip, user_agent, fingerprint);
      res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'prod' ? true : false,
        path: '/',
        maxAge: Number(process.env.COOKIE_EXPIRESIN),
        sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'lax',
      }).send(authenticateResult.authCred);
    }
    else {
      throw new BadRequestException('Invalid password or email')
    }

  }

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
    @Headers('User-Agent') user_agent: string,
    @Query('fingerprint') fingerprint: string,
    @Res() res: ExpressResponse
  ) {
    const user = await this.authService.getExistingUser(createUserDto);
    if (user) {
      throw new BadRequestException(
        `User with email: ${createUserDto.email} already exists!`
      );
    }
    const createdUserId = await this.authService.createUser(createUserDto);
    const authenticateResult = await this.authService.authenticate(createdUserId, ip, user_agent, fingerprint);
    console.log(92, authenticateResult);
    res.cookie('refresh-tokenId', authenticateResult.refreshTokenId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod' ? true : false,
      path: '/',
      maxAge: Number(process.env.COOKIE_EXPIRESIN),
      sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'lax',
    }).send(authenticateResult.authCred);
  }


  // @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  async refreshTokens(
    @Body() fingerprint: string,
    @Req() req: ExpressRequest,
    @Res({ passthrough: true }) res: ExpressResponse,
  ): Promise<{ newAccessToken: string }> {
    const refreshTokenId = req.cookies['refresh-tokenId'];
    const newTokens = await this.authService.updateTokens(
      req.body.fingerprint,
      refreshTokenId,
    );
    res.cookie('refresh-tokenId', newTokens.refreshTokenId, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'prod' ? true : false,
      maxAge: Number(process.env.COOKIE_EXPIRESIN),
      sameSite: process.env.NODE_ENV === 'prod' ? 'strict' : 'lax',
    });
    return { newAccessToken: newTokens.accessToken };
  }
}
