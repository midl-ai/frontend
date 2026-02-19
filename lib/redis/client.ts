import { createClient, type RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

/** Get or create Redis client singleton */
export async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient) {
    return redisClient;
  }

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error('REDIS_URL environment variable is required');
  }

  redisClient = createClient({ url });

  redisClient.on('error', (err) => {
    console.error('[Redis] Client error:', err);
  });

  redisClient.on('connect', () => {
    console.log('[Redis] Connected');
  });

  await redisClient.connect();

  return redisClient;
}

/** Graceful shutdown */
export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
