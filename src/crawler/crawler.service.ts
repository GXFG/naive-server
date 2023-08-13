import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import puppeteer, { KnownDevices } from 'puppeteer';
import { News } from './entities/news.entity';
import { NewsItem } from './dto/news-item.dto';

const DESKTOP_DEVICE = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
  },
};

@Injectable()
export class CrawlerService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,

    private readonly configService: ConfigService,
  ) {}

  private async initBrowser(url: string) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process', '--mute-audio'],
      timeout: this.configService.get('PUPPETEER_TIMEOUT'),
    });
    const page = await browser.newPage();
    await page.emulate(DESKTOP_DEVICE);
    await page.goto(url, { waitUntil: 'networkidle0' });
    return { browser, page };
  }

  private async saveNewsData(source: string, newsList: NewsItem[], prevData: News) {
    const payload = {
      source,
      ...prevData,
      news: JSON.stringify(newsList),
      update_time: new Date(),
    };
    return await this.newsRepository.save(payload);
  }

  async getNewsData(source: string) {
    return await this.newsRepository.findOne({
      where: {
        source,
      },
    });
  }

  async updateBaiduTrending() {
    const { browser, page } = await this.initBrowser('https://top.baidu.com/board?tab=realtime');
    const pageTitle = await page.title();

    const hotList = await page.evaluate(() => {
      const newsEleList = [...document.querySelectorAll('.category-wrap_iQLoo')];
      let newsList = newsEleList.map((item) => {
        const linkEle = item.querySelectorAll('.title_dIF3B')[0];
        const url = linkEle.getAttribute('href');
        const titleEle = item.querySelector('.c-single-text-ellipsis');
        const title = titleEle.textContent.trim();
        const hotCountEle = item.querySelector('.trend_2RttY .hot-index_1Bl1a');
        let hotCount = hotCountEle.textContent.trim();
        hotCount = `${Math.floor(+hotCount / 10000)}w`;
        return {
          url,
          title,
          hotCount,
        };
      });
      newsList = newsList.slice(1);
      return newsList;
    });

    await browser.close();

    const existNews = await this.getNewsData('baidu');
    this.saveNewsData('baidu', hotList, existNews);
    Logger.log('saveNewsData baidu');

    return {
      title: pageTitle,
      list: hotList,
    };
  }
}
