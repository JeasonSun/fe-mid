import { Controller, Get, Query } from '@nestjs/common';
import { TestService } from './test.service';
import { GetUserNameDto, ResUserInfo } from './dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private testService: TestService) {}
  @Get('cache')
  async cache(@Query() data: GetUserNameDto): Promise<ResUserInfo> {
    const user = await this.testService.getUserName(data);
    return user;
  }
}
