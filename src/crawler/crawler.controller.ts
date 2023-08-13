import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrawlerService } from '@/crawler/crawler.service';
import { NewsItem } from './dto/news-item.dto';

@ApiTags('爬虫')
@Controller('crawler')
export class CrawlerController {
  constructor(private crawlerService: CrawlerService) {}

  @Get('baidu')
  async getBaiduTrending() {
    const data = await this.crawlerService.getNewsData('baidu');
    if (!data) {
      return {};
    }
    return {
      title: data.source,
      list: JSON.parse(data.news) as NewsItem[],
    };
  }

  @Get('baidu/update')
  async updateBaiduTrending() {
    const data = this.crawlerService.updateBaiduTrending();
    return data;
  }
}
