import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ExceptionMessage, ResponseDataType } from '@/types/common';
import { BusinessException } from './business.exception';

/**
 * 统一错误返回的格式 && 日志输出
 * 1. 如果是BusinessException, 返回status:200, code: 非0
 * 2. 其他Exception, 返回相应status Code
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const exceptionMessage = (exception.getResponse() ||
      {}) as ExceptionMessage;
    let statusCode = exception.getStatus() || HttpStatus.BAD_REQUEST;
    const responseData: ResponseDataType = exceptionMessage;
    if (exception instanceof BusinessException) {
      statusCode = HttpStatus.OK;
    } else {
      responseData.code = statusCode;
    }
    responseData.extra = {
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    const commonInfo = {
      url: request.originalUrl,
      method: request.method,
      ip: request.ip,
      statusCode,
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
