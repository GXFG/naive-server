import { Module } from '@nestjs/common';
import { ScreenshotController } from '@/screenshot/screenshot.controller';
import { ScreenshotService } from '@/screenshot/screenshot.service';

@Module({
  controllers: [ScreenshotController],
  providers: [ScreenshotService],
})
export class ScreenshotModule {}
