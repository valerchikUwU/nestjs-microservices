import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { RefreshSessionModule } from '../refreshSession/refreshSession.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, '../../../../.env'),
        path.resolve(__dirname, '../../.env'),
      ],
    }),
    UserModule,
    RefreshSessionModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],  
  exports: [
    AuthService,
  ],
})
export class AuthModule {}
