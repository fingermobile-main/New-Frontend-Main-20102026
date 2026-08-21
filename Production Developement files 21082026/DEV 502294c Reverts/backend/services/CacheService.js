const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3
    });

    this.redis.on('error', (err) => {
      logger.error('❌ Redis connection error:', err.message);
    });

    this.redis.on('connect', () => {
      logger.info('✅ Redis connected');
    });
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache GET failed:', error.message);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache SET failed:', error.message);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache DELETE failed:', error.message);
      return false;
    }
  }

  async clear(pattern = '*') {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      logger.error('Cache CLEAR failed:', error.message);
      return false;
    }
  }

  async increment(key, amount = 1) {
    try {
      return await this.redis.incrby(key, amount);
    } catch (error) {
      logger.error('Cache INCREMENT failed:', error.message);
      return null;
    }
  }
}

module.exports = new CacheService();
