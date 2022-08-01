import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { getConfig } from '@/common/utils';
import { User } from '../user/user.postgres.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByName(username);
    if (user && user.password === pass) {
      const userInfo = omit(user, 'password');
      return userInfo;
    }
    return null;
  }

  async login(user: User) {
    const userInfo = omit(user, 'password');
    const payload = { ...userInfo, sub: userInfo.id };
    const jwtConfig = getConfig('JWT');

    return {
      token: this.jwtService.sign(payload),
      user: userInfo,
      expiresIn: jwtConfig.EXPIRES_IN,
    };
  }
}
