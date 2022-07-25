import { Module } from '@nestjs/common';
import { ApiConfigService } from './services/api.config.service';

const providers = [ApiConfigService];
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
