// import fs = require('fs');
import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';
import { ScreenshotDto } from './dto/screenshot.dto';
import { Logger } from '@nestjs/common';

@ApiTags('截图')
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
    if (params.scale === '0.99') {
      // Temp 暂时适配检测参数，待检测同步参数后可删除
      params.autocontrol = '0';
    }
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
      delete httpRes.hasLoadCompleteTag;
    }

    return httpRes;
  }
}
