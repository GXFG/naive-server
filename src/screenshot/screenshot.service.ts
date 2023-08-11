import * as fs from 'fs';
import * as path from 'path';
import * as dayjs from 'dayjs';
import puppeteer, { KnownDevices } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { getNonDuplicateId } from '@/common/utils';
import { ScreenshotDto } from '@/screenshot/dto/screenshot.dto';

const DESKTOP_DEVICE = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
  },
};

const CUSTOM_DEVICE = {
  name: 'custom',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 750,
    height: 1334,
  },
};

const MAX_WSE = 6; // 启动的browser个数
const TIMEOUT = 10000;

// /private/var/vm
const TEMP_PATH = process.env.RUN_ENV === 'local' ? path.dirname(path.dirname(__dirname)) : '/dev/shm';

@Injectable()
export class ScreenshotService {
  private browser: any;
  private wseList: any;

  constructor() {
    this.browser = null;
    this.wseList = []; // 存储browserWSEndpoint列表

    this.initBrowser();
  }

  private async initBrowser() {
    for (let i = 0; i < MAX_WSE; i++) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-first-run', '--no-sandbox', '--no-zygote', '--single-process', '--mute-audio'],
        timeout: TIMEOUT,
      });
      const browserWSEndpoint = await this.browser.wsEndpoint();
      this.wseList[i] = browserWSEndpoint;
    }
    Logger.log(`Bowser is ready`);
  }

  async getImgPath(query: ScreenshotDto) {
    const { autocontrol, url, device, type, format, scale, quality, width, height } = query;

    const idx = Math.floor(Math.random() * MAX_WSE);
    const browserWSEndpoint = this.wseList[idx];
    const browser = await puppeteer.connect({ browserWSEndpoint });
    const page = await browser.newPage();

    let myDevice = null;
    if (device === 'pc') {
      myDevice = DESKTOP_DEVICE;
    } else if (device === 'custom') {
      myDevice = {
        ...CUSTOM_DEVICE,
        viewport: {
          width: parseInt(width, 10),
          height: parseInt(height, 10),
        },
      };
    } else {
      myDevice = KnownDevices['iPhone 6'];
    }
    await page.emulate(myDevice);

    // 有时networkidle事件并不总是表明页面已完全加载。仍然可能有一些JS scripts修改页面上的内容!，让使用方增加autocontrol自行控制截屏时机
    // networkidle2 代表还有两个以下的request就考虑navigation结束; networkidle0 是全部request结束后navigation结束
    await page.goto(url, { waitUntil: 'networkidle0' });

    let status = false;
    let hasLoadCompleteTag = false;
    if (autocontrol === '0') {
      try {
        // 等待页面出现元素#load-complete
        await page.waitForSelector('#load-complete', {
          timeout: TIMEOUT,
          visible: true,
        });
        hasLoadCompleteTag = true;
        status = true;
      } catch (e) {
        Logger.warn('@@catch waitForSelector', url);
      }
    } else {
      status = true;
    }

    const fileName = `screenshot-${dayjs().format('YYYYMMDD-HHmmss')}-${getNonDuplicateId(6)}.${type}`;
    const tempDirPath = path.join(TEMP_PATH, './temp');
    const filePath = path.join(tempDirPath, fileName);

    if (!fs.existsSync(tempDirPath)) {
      fs.mkdirSync(tempDirPath);
    }

    if (type === 'pdf') {
      await page.pdf({
        path: filePath,
        printBackground: true,
        scale: parseFloat(scale),
        format,
      });
    } else {
      await page.screenshot({
        path: filePath,
        type: 'jpeg',
        quality: parseInt(`${quality}`, 10),
        fullPage: true,
      });
    }

    await page.close();

    return {
      status,
      hasLoadCompleteTag,
      fileName: fileName || '',
      filePath: filePath || '',
    };
  }
}
