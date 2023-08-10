import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScreenshotModule } from './screenshot/screenshot.module';

@Module({
  imports: [ScreenshotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
