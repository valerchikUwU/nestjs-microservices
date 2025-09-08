import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { ValuteService } from './valute.service';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { Course } from '@nestjs-microservices/shared';

@Controller('valute')
export class ValuteController {
    constructor(private readonly valuteService: ValuteService) { }


    @Get('actual')
    @UseGuards(AccessTokenGuard)
    async findValutes(
    ): Promise<Course> {
        const valutes = await this.valuteService.findValutes();
        return valutes;
    }



}
