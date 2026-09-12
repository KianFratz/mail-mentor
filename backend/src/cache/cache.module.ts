import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          createKeyv(
            configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
          ),
        ],
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
