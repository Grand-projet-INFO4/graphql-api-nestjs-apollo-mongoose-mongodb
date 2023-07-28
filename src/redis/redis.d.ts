import {
  RedisClientOptions,
  RedisModules,
  RedisFunctions,
  RedisScripts,
  RedisClientType,
} from 'redis';

export type RedisClientConnectionOptions = RedisClientOptions<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;

export type RedisClientInstance = RedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;
