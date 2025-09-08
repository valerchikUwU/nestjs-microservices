import { Module } from '@nestjs/common';
import { RefreshSessionController } from './refreshSession.controller';
import { RefreshSessionService } from './refreshSession.service';
import { RefreshSessionRepository } from './refreshSession.repository';
import { ConfigModule } from '@nestjs/config';
import path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshSession } from '@nestjs-microservices/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(__dirname, '../../../../.env'),
        // path.resolve(__dirname, '../../.env'),
      ],
    }),
    TypeOrmModule.forFeature([RefreshSession]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      database: process.env.SESSION_POSTGRES_DB,
      entities: [RefreshSession],
      synchronize: true,
      username: 'session_db',
      password: 'session_pass',
    }),
  ],
  controllers: [RefreshSessionController],
  providers: [RefreshSessionService, RefreshSessionRepository],
})
export class RefreshSessionModule {}
