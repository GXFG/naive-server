import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlerService } from './crawler.service';
import { CrawlerController } from './crawler.controller';
import { News } from '@/crawler/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [CrawlerService],
  controllers: [CrawlerController],
})
export class CrawlerModule {}
