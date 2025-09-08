import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from '../../../../shared/src/lib/utils/exceptionFilterRpc';
import { ValuteService } from './valute.service';

@UseFilters(new ExceptionFilter())
@Controller()
export class ValuteController {
  constructor(private readonly valuteService: ValuteService) { }

  @MessagePattern('valutes.find_cached_valutes')
  async handleFindValutes() {
    const valutes = await this.valuteService.findCachedValutes();
    return valutes;
  }
}
