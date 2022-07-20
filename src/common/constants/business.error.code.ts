export const BUSINESS_ERROR_CODE = {
  // 公共错误码
  COMMON: 100001,
  // 令牌错误
  TOKEN_INVALID: 100002,
  // 禁止访问
  ACCESS_FORBIDDEN: 100003,
  // 权限已禁用
  PERMISSION_DISABLED: 100003,
  // 用户已冻结
  USER_DISABLED: 100004,
} as const;

export type ERROR_CODE =
  typeof BUSINESS_ERROR_CODE[keyof typeof BUSINESS_ERROR_CODE];
