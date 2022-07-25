import { TestModule } from '@/modules/test/test.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';

export const CombinedModules = [TestModule, UserModule, AuthModule];
