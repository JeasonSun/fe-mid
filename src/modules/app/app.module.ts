import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as redisStore from 'cache-manager-redis-store';
import { getConfig } from '@/common/utils';
import { WinstonOption } from '@/config/winston.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CombinedModules } from './combined.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    WinstonModule.forRoot(WinstonOption()),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      db: getConfig('REDIS_CONFIG').db,
      // auth_pass: getConfig('REDIS_CONFIG').auth,
    }),
    ...CombinedModules,
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
