import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ResUserInfo } from './dto/test.dto';

@Injectable()
export class TestService {
  private TEST_USER_CACHE = 'test_user_info_by_id_cache';
  private logger: Logger = new Logger('TestService');
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // private logger: Logger,
  ) {}
  async getUserName({ id }): Promise<ResUserInfo> {
    const cacheKey = `${this.TEST_USER_CACHE}_${id}`;
    let userInfo = await this.cacheManager.get(cacheKey);
    if (!userInfo) {
      this.logger.debug({
        msg: '未获取到缓存数据',
        id,
      });
      userInfo = {
        id,
        name: `userName_${Math.random()}`,
      };
      this.cacheManager.set(cacheKey, userInfo, {
        ttl: 60 * 2, // 60 seconds
      });
    } else {
      this.logger.debug({
        msg: '缓存数据',
        id,
        userInfo,
      });
    }
    return userInfo;
  }
}
