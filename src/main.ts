import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许CORS
  app.enableCors();

  // app.use(helmet());

  app.setGlobalPrefix('/api');

  // app.use(
  //   rateLimit({

  //   })
  // )

  await app.listen(3000);
}
bootstrap();
