import { Module } from '@nestjs/common';
import { createClient } from 'redis';

import { RedisClientConnectionOptions } from './redis';

@Module({
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useFactory: (): RedisClientConnectionOptions => {
        return {
          url: process.env.REDIS_URL as string,
          socket: {
            connectTimeout: 50_000,
          },
        };
      },
    },
    {
      inject: ['REDIS_OPTIONS'],
      provide: 'REDIS_CLIENT',
      useFactory: async (options: RedisClientConnectionOptions) => {
        const client = createClient(options);
        client.on('error', (error) => {
          throw new Error(error);
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
