import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AppModule } from './app.module';
// import * as helmet from 'helmet';
// import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe()); // 验证器
  app.useGlobalFilters(new HttpExceptionFilter()); // 统一异常返回
  app.useGlobalInterceptors(new TransformInterceptor()); // 统一返回格式
  // app.enableCors();
  // app.use(helmet()); // xss
  // app.use(csurf());

  const config = new DocumentBuilder().setTitle('naive-server').setDescription('').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(5555);
  Logger.log('服务已启动: http://localhost:5555/api');
  Logger.log('api文档: http://localhost:5555/swagger');
}

bootstrap();
