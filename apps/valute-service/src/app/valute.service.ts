import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { SocketService } from '../socket/socket.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Course, RpcInternalServerException } from '@nestjs-microservices/shared';
import { parseCurrencyRates } from './helpers/parserHtml';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ValuteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly socketService: SocketService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) { }

  onModuleInit() {
    this.findValutes();
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async findValutes(): Promise<void> {
    try {
      const cachedValutes = await this.cacheService.get<Course>('courses');
      if (!cachedValutes) {

        const valutes = await firstValueFrom(this.httpService.get<Course>('https://www.cbr-xml-daily.ru/daily_json.js').pipe(
          map(response => response.data),
          catchError((err: AxiosError) => {
            console.log(err)
            throw new ServiceUnavailableException('Valutes unavailable');
          })
        ));
        const parsedAskBid = await firstValueFrom(this.httpService.get<string>('https://ru.myfin.by/currency').pipe(
          map(response => response.data),
          catchError((err: AxiosError) => {
            console.log(err)
            throw new ServiceUnavailableException('Ask bid unavailable');
          })
        ));
        const transformedAskBid: { code: string, name: string, buy: number, sell: number, centralBankRate: number }[] = parseCurrencyRates(parsedAskBid);
        Object.keys(valutes.Valute).forEach(key => {
          valutes.Valute[key].bid = transformedAskBid.find(item => item.code === valutes.Valute[key].CharCode)?.buy || 0;
          valutes.Valute[key].ask = transformedAskBid.find(item => item.code === valutes.Valute[key].CharCode)?.sell || 0;
        })
        this.cacheService.set<Course>(`courses`, valutes, 21599000)
        console.log('parsed');
        this.socketService.emitValutes(valutes);
      } else {
        this.socketService.emitValutes(cachedValutes);
      }
    }
    catch (err) {
      throw new RpcInternalServerException('Ошибка при получении курсов валют')
    }
  }

  async findCachedValutes(): Promise<Course> {
    const cachedValutes = await this.cacheService.get<Course>('courses');
    if (!cachedValutes) {
      throw new RpcInternalServerException('No cached valutes');
    }
    return cachedValutes;
  }

}
