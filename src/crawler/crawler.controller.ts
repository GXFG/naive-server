import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrawlerService } from '@/crawler/crawler.service';

@ApiTags('爬虫')
@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @Get('baidu')
  async getOssUrlFromScreenshot() {
    const data = this.crawlerService.getBaiduTrending();
    return data;
  }
}
