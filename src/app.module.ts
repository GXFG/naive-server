import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from './crawler/crawler.module';
import { ScreenshotModule } from '@/screenshot/screenshot.module';

@Module({
  imports: [CrawlerModule, ScreenshotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
