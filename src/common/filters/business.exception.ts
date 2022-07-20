import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionMessage } from '@/types';
import { BUSINESS_ERROR_CODE, ERROR_CODE } from '@/common/constants';

export class BusinessException extends HttpException {
  constructor(error: ExceptionMessage | string, code?: ERROR_CODE) {
    let errorMessage = {} as ExceptionMessage;
    if (typeof error === 'string') {
      errorMessage = {
        message: error,
        code: BUSINESS_ERROR_CODE.COMMON,
      };
    } else {
      errorMessage = error;
    }
    if (code) {
      errorMessage.code = code;
    }
    super(errorMessage, HttpStatus.OK);
  }
}
