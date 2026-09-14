import { Module } from '@nestjs/common';
import { DollarController } from './dollar.controller';
import { DollarService } from './dollar.service';

@Module({
  controllers: [DollarController],
  providers: [DollarService],
  exports: [DollarService],
})
export class DollarModule {}
