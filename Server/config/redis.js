import Redis from 'ioredis';
import fs from 'fs';


let REDIS_HOST_FILE;
try {
  REDIS_HOST_FILE = fs.existsSync('/mnt/ssm-secrets/REDIS_HOST') 
    ? fs.readFileSync('/mnt/ssm-secrets/REDIS_HOST', 'utf8').trim() 
    : undefined;
} catch { 
  REDIS_HOST_FILE = undefined; 
}
const redishost = process.env.REDIS_HOST;
const redis = new Redis( redishost|| REDIS_HOST_FILE|| 'redis://127.0.0.1:6379', {
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