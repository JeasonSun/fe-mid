import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable, NotAcceptableException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.postgres.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleType } from '@/common/constants';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;
  private readonly logger = new Logger('UserService');

  async create(payload: CreateUserDto) {
    const exist = await this.getByEmail(payload.email);
    if (exist) {
      throw new NotAcceptableException('email已经注册用户');
    }
    const user = new User();
    user.username = payload.username;
    user.password = payload.password;
    user.email = payload.email;
    return this.userRepository.save(user);
  }

  async getByEmail(email: string): Promise<any> {
    return this.userRepository.findOneBy({ email });
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }
  async findOneByName(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { username, password, email } = updateUserDto;
    return this.userRepository.update({ id }, { username, password, email });
  }

  async remove(id: string) {
    return this.userRepository.delete({ id });
  }

  async checkAdmin(id: string) {
    return this.userRepository.findOneBy({ id, role: RoleType.ADMIN });
  }
}
