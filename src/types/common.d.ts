export type ExceptionMessage = {
  message: any; // 错误提示
  code?: number; // 错误码
  data?: any;
};

type ResponseExtraData = {
  path?: string;
  timestamp?: string;
};
export type ResponseDataType = {
  code?: number;
  message?: any;
  data?: any;
  extra?: ResponseExtraData & Record<string, any>;
  [x: string]: any;
};
