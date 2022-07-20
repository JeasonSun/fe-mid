declare const module: any;
import { NestFactory } from '@nestjs/core';
import rateLimit from 'express-rate-limit';

import { HttpExceptionFilter } from '@/common/filters/http.exception.filter';
import { AllExceptionsFilter } from '@/common/filters/base.exception.filter';
import { RequestInterceptor } from '@/common/interceptors/request.interceptor';
import { EnhanceLogInterceptor } from '@/common/interceptors/enhance.log.interceptor';
import { AppModule } from '@/modules/app/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = '/api';
  // 允许CORS
  app.enableCors();

  // app.use(helmet());

  app.setGlobalPrefix(globalPrefix);

  // 单位时间内超过一定数量的请求后，阻止来自客户端的链接。
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 100,
    }),
  );

  app.enableVersioning();

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new EnhanceLogInterceptor(),
    new RequestInterceptor(),
  );

  const config = app.get<ConfigService>(ConfigService);

  const port = config.get('APP_CONFIG.PORT') || 8081;

  await app.listen(port);

  const configUrl = config.get('APP_CONFIG.URL');
  const serverUrl = await app.getUrl();
  console.info(`\n  server running on: 👇

  ${serverUrl}${globalPrefix}
  ${configUrl}:${port}${globalPrefix}

  `);

  // 添加热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  return app;
}
bootstrap();
