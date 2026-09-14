import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { DollarService } from './dollar.service';

@ApiTags('Dollar Rates (VES)')
@Controller('dollar')
export class DollarController {
  constructor(private readonly dollarService: DollarService) {}

  @Get('rates')
  @Throttle({ medium: { limit: 30, ttl: 60000 } }) // 30 req/min max for this endpoint
  @ApiOperation({
    summary: 'Get live USD/VES exchange rates (BCV oficial + paralelo)',
    description:
      'Sourced from ve.dolarapi.com with 15-minute server-side cache. No auth required.',
  })
  async getRates() {
    return this.dollarService.getSummary();
  }
}
