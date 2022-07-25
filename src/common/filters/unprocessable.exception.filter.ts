import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import * as _ from 'lodash';
import type { Response, Request } from 'express';

/**
 * 参数验证失败的filter
 */
@Catch(UnprocessableEntityException)
export class UnprocessableExceptionFilter
  implements ExceptionFilter<UnprocessableEntityException>
{
  private logger = new Logger('UnprocessableExceptionFilter');

  catch(exception: UnprocessableEntityException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const r = exception.getResponse() as {
      message: ValidationError[];
      code?: number;
      error?: string;
    };

    const { message: validationErrors, code, error } = r;

    this.validationFilter(validationErrors);
    const responseData = {
      code: code || statusCode,
      message: error || '参数错误',
      error: validationErrors,
      // request.url,
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

  private validationFilter(validationErrors: ValidationError[]): void {
    for (const validationError of validationErrors) {
      delete validationError.target;
      const children = validationError.children;
      if (children && !_.isEmpty(children)) {
        this.validationFilter(children);
        return;
      }

      delete validationError.children;

      const constraints = validationError.constraints;

      if (!constraints) {
        return;
      }

      for (const [constraintKey, constraint] of Object.entries(constraints)) {
        if (!constraint) {
          // convert to 下划线
          // eg: fooBar => foo_bar
          // eg: Foo Bar => foo_bar
          constraints[constraintKey] = `error.fields.${_.snakeCase(
            constraintKey,
          )}`;
        }
      }
    }
  }
}
