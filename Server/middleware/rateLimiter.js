import redis from '../config/redis.js'; 

export default async function rateLimiter(req, res, next) {
  const key = `rate_limit`;

  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, process.env.WINDOW_SECONDS || 3600);
    }

    if (current > (process.env.MAX_REQUESTS || 5000)) {
      
      const ttl = await redis.ttl(key); 
      
      const err = new Error('Our Servers request limit has been reached.');
      err.status = 429;
      err.code = 'RATE_LIMITED';
      
      
      err.retryAfterSeconds = ttl; 
      
      return next(err);
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err.message);
    next(err);
  }
}