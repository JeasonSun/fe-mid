import axios, { AxiosRequestConfig } from 'axios';
import { getConfig } from './config';
import {
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

const { SERVER_HOST } = getConfig();
const logger = new Logger('requestUtil');

export const request = axios.create();
request.interceptors.request.use((config: AxiosRequestConfig) => {
  config['metadata'] = { ...config['metadata'], startDate: new Date() };
  const { url = '/', method = 'GET' } = config;
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else if (/::/.test(url)) {
    const [domain, path] = url.split('::');
    const host = SERVER_HOST[domain.toUpperCase()];
    if (host) {
      sendUrl = `${host}${path}`;
    } else {
      console.log('不存在Host', url, method);
      throw new NotFoundException(
        {
          url,
          method,
          message: `没有配置Host:${domain.toUpperCase()}`,
          stack: '@/utils/request.ts',
        },
        'Request Host Not Found',
      );
    }
  } else {
    sendUrl = url;
  }
  config.url = sendUrl;
  logger.log(
    `${method.toUpperCase()} ${config.url}   ${JSON.stringify({
      headers: config?.headers,
      type: 'Axois Request Util',
      params: config.params,
      data: config.data,
    })}`,
  );

  return config;
});

request.interceptors.response.use(
  (response) => {
    const { config } = response;
    const { method = 'GET' } = config;

    config['metadata'] = { ...config['metadata'], endDate: new Date() };
    if (response.status !== 200) {
      throw new HttpException(response.statusText, response.status);
    }
    const duration =
      config['metadata'].endDate.getTime() -
      config['metadata'].startDate.getTime();

    logger.log(
      `${method.toUpperCase()} ${config.url} ${duration}ms  ${JSON.stringify({
        type: 'Axois Response Util',
        data: response.data,
      })}`,
    );

    return response.data;
  },
  function (error) {
    const { response, config = {} } = error;
    if (error instanceof NotFoundException) {
      throw new HttpException(response, HttpStatus.NOT_FOUND);
    }

    // 应该对三方的请求错误类型进行集中处理。
    // `转发请求接口=${url},参数为=${JSON.stringify(data)},错误原因=${err.msg || '请求报错了'}; 请求接口状态code=${err.errCode}`

    const { url, method } = config;
    const { status, statusText, data } = response;
    const message = `转发请求接口发生错误:${method}-${url} `;
    logger.error(
      `${message} ${JSON.stringify({
        status,
        statusText,
        data,
      })}`,
    );

    throw new HttpException(
      {
        message,
        code: status,
        error: statusText,
      },
      response.status,
    );
  },
);
