import axios, { AxiosRequestConfig } from 'axios';
import { getConfig } from './config';
import { Logger, NotFoundException, HttpException } from '@nestjs/common';

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
  // function ({ response, config }) {
  //   console.log('难不成在这里返回', response, config);
  //   throw new HttpException(
  //     {
  //       message: response.statusText,
  //       code: response.status,
  //       error: response.data,
  //     },
  //     response.status,
  //   );
  // },
);
