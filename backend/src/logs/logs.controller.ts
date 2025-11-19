import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogsService } from './logs.service';
import { FilterLogsDto } from './dto/filter-logs.dto';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@Query() filter: FilterLogsDto) {
    return this.logsService.findAll(filter);
  }

  @Get('last-by-lote')
  lastByLote(@Query('leilaoId') leilaoId: string, @Query('loteNumero') loteNumero: string) {
    return this.logsService.findLastByLote(leilaoId, loteNumero);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }
}
