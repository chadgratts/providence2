import Redis from 'ioredis'; // is this like pg?

export class RedisService {
  private redis: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }
    this.redis = new Redis(redisUrl);

    this.redis.on('connect', () => console.log('Connected to Redis!'));
    this.redis.on('error', (err) => console.error('Redis connection error:', err));
  }

  async setSession(key: string, data: string): Promise<void> {
    try {
      console.log('Setting session in Redis:', key, data);
      await this.redis.call('JSON.SET', key, '.', JSON.stringify(data));
      console.log(`Session set for key: ${key}`);
    } catch (error) {
      console.error('Error setting session in Redis:', error);
    }
  }

  async getSession(key: string): Promise<string | null> {
    try {
      const data = await this.redis.call('JSON.GET', key);
      return data as string | null;
    } catch (error) {
      console.error('Redis session data fetch error:', error);
      throw error;
    }
  }
}
