import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';

export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

export const getConfig = (name?: string) => {
  const environment = getEnv();
  const yamlPath = path.join(process.cwd(), `./.config/.${environment}.yaml`);
  const isExist = fs.existsSync(yamlPath);
  if (!isExist) {
    throw new Error(`配置文件不存在: ${yamlPath}`);
  }
  const file = fs.readFileSync(yamlPath, 'utf8');
  const config = parse(file);
  if (name) {
    return config[name] || {};
  } else {
    return config;
  }
};
