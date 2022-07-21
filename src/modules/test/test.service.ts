import { Injectable } from '@nestjs/common';
import { ResUserInfo } from './dto/test.dto';

@Injectable()
export class TestService {
  async getUserName({ id }): Promise<ResUserInfo> {
    return {
      id,
      name: 'test',
    };
  }
}
