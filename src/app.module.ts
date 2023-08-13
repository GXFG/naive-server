import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import configGenerator from '@/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CrawlerModule } from '@/crawler/crawler.module';
import { ScreenshotModule } from '@/screenshot/screenshot.module';

@Module({
  imports: [
    configGenerator(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // 不应在生产中使用设置true，否则可能会丢失生产数据
    }),
    CrawlerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
