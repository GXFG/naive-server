import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

// 参数为空捕获每一个未处理的异常， @Catch(HttpException)仅捕获Http异常
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      const exceptionRes = exception.getResponse();
      statusCode = exception.getStatus();
      if (typeof exceptionRes === 'string') {
        message = exceptionRes;
      } else if (typeof exceptionRes === 'object' && 'message' in exceptionRes) {
        message = exceptionRes.message.toString();
      } else {
        message = exception.message;
      }
    }

    Logger.error('请求错误', `${statusCode} ${request.originalUrl} ${message}`);

    const errorResponse = {
      code: statusCode,
      message,
      path: request.originalUrl,
      timestamp: new Date().getTime(),
    };

    // response.header('Content-Type', 'application/json; charset=utf-8');
    response.status(statusCode).json(errorResponse);
  }
}
