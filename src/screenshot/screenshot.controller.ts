// import fs = require('fs');
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScreenshotService } from '@/screenshot/screenshot.service';
import { ScreenshotDto } from '@/screenshot/dto/screenshot.dto';

@ApiTags('截屏')
@Controller('screenshot')
export class ScreenshotController {
  constructor(private screenshotService: ScreenshotService) {}

  @Get()
  async getOssUrlFromScreenshot(@Query() query: ScreenshotDto): Promise<any> {
    const params = {
      ...query,
      url: RegExp(/http/).exec(query.url) ? query.url : `http://${query.url}`,
      device: query.device || 'h5',
      width: query.width || '750',
      height: query.height || '1334',
      type: query.type || 'jpg',
      format: query.format || 'a4',
      scale: query.scale || '1',
      quality: parseInt(`${query.quality || 60}`, 10),
      autocontrol: query.autocontrol || '1',
    };
    const res = await this.screenshotService.getImgPath(params);
    const fileUrl = '';

    if (res.status) {
      const { fileName, filePath } = res;
      console.log(fileName, filePath);

      Logger.log(fileName, filePath);

      // setTimeout(() => {
      //   fs.unlink(filePath, (e) => {
      //     if (e) {
      //       Logger.error(`delete filePath: ${e}`);
      //     }
      //   });
      // }, 2000);
      Logger.log('screenshot success', params.url);
    }

    const httpRes = {
      fileUrl,
      pageUrl: params.url,
      quality: params.quality,
      hasLoadCompleteTag: res.hasLoadCompleteTag,
    };
    if (params.autocontrol === '1') {
      // 自动控制
      Reflect.deleteProperty(httpRes, 'hasLoadCompleteTag');
    }

    return httpRes;
  }
}
