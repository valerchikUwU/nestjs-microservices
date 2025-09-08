import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RefreshSessionService } from '../refreshSession/refreshSession.service';
import { AuthDto, CreateRefreshSessionDto, RpcInternalServerException, RpcUnauthorizedException } from '@nestjs-microservices/shared';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(
        private readonly refreshSessionService: RefreshSessionService,
        private readonly jwtService: JwtService,
    ) { }

    async hashPassword(password: string): Promise<string> {
        try {
            const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
            return hash;
        }
        catch (err) {
            throw new RpcInternalServerException('Ошибка при расхешировании пароля!')
        }
    }

    async comparePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        }
        catch (err) {
            throw new RpcInternalServerException('Ошибка при сравнении паролей!')
        }
    }




    async isSessionExpired(
        fingerprint: string,
        refreshTokenId: string,
    ): Promise<{ isExpired: boolean; userId: string }> {
        try {
            const session = await this.refreshSessionService.findOneByIdAndFingerprint(
                String(refreshTokenId),
                String(fingerprint),
            );
            if (session === null) {
                return { isExpired: true, userId: null };
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const isExpired = currentTime > session.expiresIn;
            return { isExpired: isExpired, userId: session.userId };
        }
        catch (err) {
            throw new RpcInternalServerException('Ошибка при проверки сессии на просроченность')
        }
    }

    async authenticate(
        userId: string,
        ip: string,
        user_agent: string,
        fingerprint: string,
    ): Promise<{ authCred: AuthDto; refreshTokenId: string }> {
        try {
            const newSession: CreateRefreshSessionDto = {
                user_agent: user_agent,
                fingerprint: fingerprint,
                ip: ip,
                expiresIn: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
                refreshToken: await this.jwtService.signAsync(
                    { id: userId },
                    {
                        secret: process.env.JWT_REFRESH_SECRET,
                        expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
                    },
                ),
                userId: userId,
            };
            const _newSessionId = await this.refreshSessionService.create(newSession);
            const _user: AuthDto = {
                userId: userId,
                accessToken: await this.jwtService.signAsync(
                    { id: userId },
                    {
                        secret: process.env.JWT_ACCESS_SECRET,
                        expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
                    },
                ),
            };

            return { authCred: _user, refreshTokenId: _newSessionId };
        } catch (err) {
            throw new RpcInternalServerException('Ошибка при аутентификации!');
        }
    }



    async updateTokens(
        fingerprint: string,
        refreshTokenId: string,
    ): Promise<{ accessToken: string, refreshTokenId: string }> {
        try {
            const session = await this.refreshSessionService.findOneByIdAndFingerprint(
                String(refreshTokenId),
                String(fingerprint),
            );

            if (!session) {
                console.log(
                    `Попытка обновления токенов с fingerprint: ${fingerprint} и refreshTokenId: ${refreshTokenId}`,
                );
                await this.refreshSessionService.remove(refreshTokenId);
                throw new RpcUnauthorizedException(
                    'Войдите в свой аккаунт для дальнейшей работы!',
                );
            }
            const currentTime = Math.floor(Date.now() / 1000);
            const isExpired = currentTime > session.expiresIn;
            if (isExpired) {
                await this.refreshSessionService.remove(refreshTokenId);
                throw new RpcUnauthorizedException(
                    'Ваша сессия истекла, пожалуйста, войдите еще раз в свой аккаунт.',
                );
            }
            const newSession: CreateRefreshSessionDto = {
                user_agent: session.user_agent,
                fingerprint: session.fingerprint,
                ip: session.ip,
                expiresIn: session.expiresIn,
                refreshToken: await this.jwtService.signAsync(
                    { id: session.userId },
                    {
                        secret: process.env.JWT_REFRESH_SECRET,
                        expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
                    },
                ),
                userId: session.userId,
            };

            const [removed, newSessionId] = await Promise.all([
                this.refreshSessionService.remove(session.id),
                await this.refreshSessionService.create(newSession)
            ])
            const _newAccessToken = await this.jwtService.signAsync(
                { id: newSession.userId },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
                },
            );
            console.log(
                `CREATED SESSION WITH ID: ${newSessionId} - Создана сессия!`,
            );
            return { accessToken: _newAccessToken, refreshTokenId: newSessionId };
        } catch (err) {
            if (err instanceof RpcUnauthorizedException) {
                throw err;
            }

            throw new RpcInternalServerException(
                'Ой, что - то пошло не так при обновлении токенов!',
            );
        }
    }
}
