import { BusinessException } from './../../common/filters/business.exception';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BUSINESS_ERROR_CODE } from '@/common/constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // throw new Error('测试');
    throw new BusinessException('测试', BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN);
    return this.appService.getHello();
  }
}
