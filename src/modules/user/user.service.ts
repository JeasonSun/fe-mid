import { Injectable, NotAcceptableException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pick } from 'lodash';
import { User } from './user.postgres.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  private readonly logger = new Logger('UserService');
  async create(payload) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException('email已经注册用户');
    }
    const newUser = await this.userRepository.save(payload);

    return pick(newUser, ['id', 'username', 'email']);
  }

  async getByEmail(email: string): Promise<any> {
    return await this.userRepository.findOneBy({ email });
  }
}
