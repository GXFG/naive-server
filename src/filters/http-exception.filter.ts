import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const message = exception.getResponse().message || exception.message || 'fail';
    const statusCode = exception.getStatus() || 500;

    Logger.error('请求错误', `${statusCode} ${request.originalUrl} ${JSON.stringify(message)}`);

    const errorResponse = {
      data: {
        error: exception.message,
      },
      message: message,
      code: statusCode,
      url: request.originalUrl,
    };

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
