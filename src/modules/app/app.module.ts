import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '@/common/utils';
import { WinstonOption } from '@/config/winston.config';
import { SharedModule } from '@/modules/shared/shared.module';
import { ApiConfigService } from '@/modules/shared/services/api.config.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CombinedModules } from './combined.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      inject: [ApiConfigService],
      useFactory: async (configService: ApiConfigService) =>
        configService.postgresConfig,
    }),
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
      auth_pass: getConfig('REDIS_CONFIG').pass,
    }),

    ...CombinedModules,
  ],
  controllers: [AppController],
  providers: [Logger, AppService],
})
export class AppModule {}
