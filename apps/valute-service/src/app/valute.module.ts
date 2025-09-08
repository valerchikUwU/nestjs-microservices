import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ValuteService } from './valute.service';
import { HttpModule } from '@nestjs/axios';
import { SocketModule } from '../socket/socket.module';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ValuteController } from './valute.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    SocketModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [
            new KeyvRedis(
              {
                url: `redis://valerchik:1234@redis:6379`,
                username: `valerchik`,
                password: `1234`,
              },
            ),
          ],
        };
      },
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: `redis://valerchik:1234@redis:6379`,
      }),
    }),
  ],
  controllers: [ValuteController],
  providers: [ValuteService],
})
export class ValuteModule { }
