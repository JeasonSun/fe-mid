# FE-MID-STARTER

前端中间层统一架构

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

### TODO:

- 业务错误码已经定义，但是否能够提供默认统一的错误描述。
- 统一日志输出内容规范，并且需要动态处理日志等级。
- 根据实际业务，配置日志输出目标，细化日志输出落库与轮转功能。
