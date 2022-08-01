import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { UserModule } from '@/modules/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getConfig } from '@/common/utils/config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: getConfig('JWT').SECRET,
      signOptions: { expiresIn: `${getConfig('JWT').EXPIRES_IN}m` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
