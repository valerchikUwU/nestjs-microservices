import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from '../config/access-jwt-strategy';
import { RefreshTokenStrategy } from '../config/refresh-jwt-strategy';
import { UserModule } from '../user/user.module';
import { FinancialModule } from '../financial/financial.module';
import { SocketModule } from '../socket/socket.module';
import { ValuteModule } from '../valute/valute.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FinancialModule,
    SocketModule,
    ValuteModule,
    PassportModule.register({}),
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, AccessJwtStrategy, RefreshTokenStrategy],
  exports: [
    PassportModule,
    AccessJwtStrategy,
    RefreshTokenStrategy,
  ]
})
export class AppModule {}
