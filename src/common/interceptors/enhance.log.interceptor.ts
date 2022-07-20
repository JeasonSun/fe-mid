import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { Request } from 'express';
import { getCircularReplacer } from '@/common/utils';

@Injectable()
export class EnhanceLogInterceptor implements NestInterceptor {
  private logger = new Logger('EnhanceLogInterceptor');
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const name = context.getClass().name;
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const startTime = new Date().getTime();
    const commonInfo = {
      url: request.originalUrl,
      method: request.method,
      ip: request.ip,
    };

    this.logger.log(
      `[${name}]  [Start]  ${commonInfo.method.toUpperCase()}  ${
        commonInfo.url
      }  ${JSON.stringify(
        {
          headers: request?.headers,
          // if body is multipart, request.body={}
          value: request.body,
          ...commonInfo,
        },
        // getCircularReplacer(),
      )}`,
    );
    return next.handle().pipe(
      tap({
        next: (value) => {
          const endTime = new Date().getTime();
          const duration = endTime - startTime;
          this.logger.log(
            `[${name}]  [End]  ${commonInfo.method.toUpperCase()}  ${
              commonInfo.url
            }  ${duration}ms  ${JSON.stringify(
              { data: value, ...commonInfo },
              getCircularReplacer(),
            )}`,
          );
        },
      }),
    );
  }
}
