import { getConfig } from '@/common/utils';

const appName = getConfig('APP_NAME');
const appDescription = getConfig('APP_DESCRIPTION');

export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_NAME = `${appName} API`;
export const SWAGGER_API_DESCRIPTION =
  appDescription || 'Simple API Description';
export const SWAGGER_API_CURRENT_VERSION = '1.0';
