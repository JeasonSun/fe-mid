import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ResponseDataType } from '@/types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = HttpStatus.SERVICE_UNAVAILABLE;
    const responseData: ResponseDataType = {
      code: statusCode,
      message: exception.message || '内部发生错误',
      extra: {
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    };
    const commonInfo = {
      url: request.originalUrl,
      method: request.method,
      ip: request.ip,
    };
    // 输出日志
    this.logger.error(
      `${commonInfo.method.toUpperCase()}  ${commonInfo.url}  ${JSON.stringify({
        ...responseData,
        ...commonInfo,
      })}`,
      exception.stack,
    );

    response.status(statusCode).json(responseData);
  }
}
