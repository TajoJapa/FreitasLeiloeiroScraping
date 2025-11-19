import { Module } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [LogsModule],
  providers: [ScraperService],
  controllers: [ScraperController],
})
export class ScraperModule {}
