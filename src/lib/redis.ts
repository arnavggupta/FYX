import Redis from 'ioredis';

let redis: Redis | null = null;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL as string);
  }
  return redis;
};

export default getRedis;