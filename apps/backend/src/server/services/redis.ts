// @ts-ignore - ioredis ESM default
import Redis from 'ioredis';
import type { Redis as RedisType } from 'ioredis';

let client: RedisType | null = null;

export function getRedis(): RedisType {
  if (!client) {
    // @ts-ignore - constructor typing
    client = new (Redis as any)(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  return client as RedisType;
}