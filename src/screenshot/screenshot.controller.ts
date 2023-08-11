// import fs = require('fs');
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScreenshotService } from '@/screenshot/screenshot.service';
import { ScreenshotDto } from '@/screenshot/dto/screenshot.dto';

@ApiTags('screenshot')
@Controller('screenshot')
export class ScreenshotController {
  constructor(private screenshotService: ScreenshotService) {}

  @Get()
  async getOssUrlFromScreenshot(@Query() screenshotDto: ScreenshotDto): Promise<any> {
    const params = {
      ...screenshotDto,
      url: RegExp(/http/).exec(screenshotDto.url) ? screenshotDto.url : `http://${screenshotDto.url}`,
      device: screenshotDto.device || 'h5',
      width: screenshotDto.width || '750',
      height: screenshotDto.height || '1334',
      type: screenshotDto.type || 'jpg',
      format: screenshotDto.format || 'a4',
      scale: screenshotDto.scale || '1',
      quality: parseInt(`${screenshotDto.quality || 60}`, 10),
      autocontrol: screenshotDto.autocontrol || '1',
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
