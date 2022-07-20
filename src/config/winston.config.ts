import { format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import 'winston-daily-rotate-file';
import { getConfig } from '@/common/utils';

const appName = getConfig('APP_NAME');

const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.align(),
  nestWinstonModuleUtilities.format.nestLike(appName, {
    prettyPrint: true,
  }),
);

const defaultOptions = {
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

export function WinstonOption() {
  return {
    exitOnError: false,
    format: customFormat,
    transports: [
      new transports.Console(),
      new transports.DailyRotateFile({
        format: format.combine(
          //这里重写关闭颜色，否则写入文件会乱码
          format.uncolorize(),
        ),
        filename: './logs/application-%DATE%.log',
        ...defaultOptions,
      }),
    ],
  };
}
