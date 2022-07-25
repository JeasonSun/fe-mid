import { Body, Controller, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { UserService } from '@/modules/user/user.service';
import { RegisterUserDto } from './dto/register.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() payload: RegisterUserDto): Promise<void> {
    return this.userService.create(payload);
  }
}
