import { Course } from '@nestjs-microservices/shared';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ValuteService {
    constructor(
        @Inject('VALUTE_SERVICE') private readonly valuteNatsClient: ClientProxy,
    ) { }

    async findValutes() {
        const valutes = await lastValueFrom(this.valuteNatsClient.send<Course>('valutes.find_cached_valutes', {})).catch(err => {
            throw new HttpException(err.message, err.statusCode);
        });
        return valutes;
    }
}
