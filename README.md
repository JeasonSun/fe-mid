# FE-MID-STARTER

前端中间层统一架构，使用 NestJS 构建的一个用于服务聚合的 BFF 层。

## 技术选型

- NestJS 9.x
- Express

## 环境变量

| 变量名      | 变量值 | 说明                                            |
| ----------- | ------ | ----------------------------------------------- |
| RUNNING_ENV | dev    | 当前运行环境名称，对应.config/.${env}.yaml 文件 |

## 业务封装

### BusinessException 业务层发生错误

```typescript
throw new BusinessException(
  '我是业务错误',
  BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
);
```

### 统一返回格式

```typescript
export type ResponseDataType = {
  code?: number;
  message?: any;
  data?: any;
  extra?: ResponseExtraData & Record<string, any>;
};
```

- http.exception.filter.ts 中捕捉 HttpException 错误，并返回统一错误格式
- BusinessException 继承 HttpException，返回格式 statusCode = 200，即接口正常响应。 但是其中 code 值为`common/constants/business.error.code.ts`中定义的业务错误码。
- RequestInterceptor 对正确响应进行格式规范。其中 statusCode = 200，code = 0。

### 日志输出

- 使用 winston 作为日志处理库。
- 在 EnhanceLogInterceptor 和 RequestInterceptor 进行统一的日志输出。
- 在 Exception 中进行错误日志输出。
- 在 Module 中使用，如果以 Inject 方式注入使用，无法在该模块中全局定义 context，需要在不同的方法中传入 context。

```typescript
@Injectable()
export class TestService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: Logger,
  ) {
    this.logger.log('logger信息');
    this.logger.log('带有context的logger信息', 'TestService');
  }
}
// 日志输出如下：
// [Nest] 53053  - 2022/07/22 10:36:12     LOG logger信息
// [Nest] 53053  - 2022/07/22 10:36:12     LOG [TestService] 带有context的logger信息
```

- 可以使用实例化的 Logger，这样就能在该模块全局注入 context

### 缓存

- 使用 cache-manager 库作为内存高速缓存。
- 其中全局的 CacheKey 可以统一在 common/cache.key.ts 中配置。
- 内存缓存可以与 Redis 等联合使用。

### 数据库

- 作为中间层，应该尽量减少直接的数据库操作，但是作为基础框架，我们提供数据库的选型和 Demo。

### DTO & 类验证器

- 依赖：class-validator class-transformer
- 自定义 ValidatePipe
- 在 DTO 中使用相关装饰器
- 全局 filter:UnprocessableExceptionFilter 中能够捕捉到相关错误。

### TODO & QA:

- 业务错误码已经定义，但是否能够提供默认统一的错误描述。
- 统一日志输出内容规范，并且需要动态处理日志等级。
- 根据实际业务，配置日志输出目标，细化日志输出落库与轮转功能。
- 优化 UnprocessableExceptionFilter，输出具体 target 等信息。
- SSR
- Logger 需要再次处理，无法输出 Object，需要手动 Stringify 一下。
- 数据库每次都要 imports && exports ?

### Demos:

#### Cache Manager

- 抹平 Cache 操作
- 接入 Redis

#### Database

- 配置

##### Redis

##### Postgres

##### Mysql
