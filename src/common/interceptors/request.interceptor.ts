import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import type { Request, Response } from 'express';
import { ResponseDataType } from '@/types';

const check_list = ['/api', '/test'];

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const host = context.switchToHttp();
    const req = host.getRequest<Request>();
    const res = host.getResponse<Response>();
    const url = req.url;

    let isCheckAPI = false;
    for (const prefix of check_list) {
      if (url.startsWith(prefix)) {
        isCheckAPI = true;
        break;
      }
    }

    if (isCheckAPI) {
      return next.handle().pipe(
        map((data = {}) => {
          /* 这里拦截POST返回的statusCode,它默认返回201，这里改为200 */
          if (res.statusCode === HttpStatus.CREATED && req.method === 'POST') {
            res.statusCode = HttpStatus.OK;
          }
          const resData: ResponseDataType = {
            code: 0,
            message: '接口请求成功',
            data,
            extra: {
              path: url,
              timestamp: new Date().toISOString(),
            },
          };
          return resData;
        }),
      );
    }
  }
}
