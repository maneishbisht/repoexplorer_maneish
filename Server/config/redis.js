import Redis from 'ioredis';

const redis = new Redis({
  host: (process.env.REDIS_HOST)||'127.0.0.1',
  port: parseInt((process.env.REDIS_PORT) || '6379'),
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 200, 2000);
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});

export default redis;
