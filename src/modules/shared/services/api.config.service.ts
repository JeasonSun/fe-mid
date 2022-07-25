import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get postgresConfig(): TypeOrmModuleOptions {
    console.log(path.join(__dirname, `../../../**/*.postgres.entity{.ts,.js}`));
    return {
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      host: this.getString('POSTGRES_CONFIG.host'),
      port: this.getNumber('POSTGRES_CONFIG.port'),
      username: this.getString('POSTGRES_CONFIG.username'),
      password: this.getString('POSTGRES_CONFIG.password'),
      database: this.getString('POSTGRES_CONFIG.database'),
      logging: this.getBoolean('POSTGRES_CONFIG.enable_orm_logs'),
      // entities: [
      //   path.join(__dirname, `../../../**/*.postgres.entity{.ts,.js}`),
      // ],
    };
  }

  private getString(key: string): string {
    const value = this.get(key);
    return value.replace(/\\n/g, '\n');
  }

  private getNumber(key: string): number {
    const value = this.get(key);
    try {
      return Number(value);
    } catch (error) {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch (error) {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }
}
