import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.postgres.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  async create(payload) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException('email已经注册用户');
    }
    // return await this.userRepository.save(payload);
  }

  async getByEmail(email: string): Promise<any> {
    return await this.userRepository.findOneBy({ email });
  }
}
