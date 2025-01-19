import Redis from 'ioredis'; // is this like pg?

export class RedisService {
  private redis: Redis;

  constructor() {
    if (!process.env.REDIS_URL) throw new Error('REDIS_URL is not defined');
    this.redis = new Redis(process.env.REDIS_URL);
  }

  getSession = async (key: string): Promise<string | null> => {
    try {
      const data = await this.redis.call('JSON.GET', key);
      return data as string | null;
    } catch (error) {
      console.error('Redis session data fetch error:', error);
      throw error;
    }
  }

  addSession = async (key: string, data: string): Promise<void> => {
    const sessionExists = await this.sessionExists(key);
    if (sessionExists) {
      await this.appendRRwebData(key, data);
    } else {
      await this.createNewSession(key, data)
    }
  }

  private sessionExists = async (key: string): Promise<boolean> => {
    try {
      const data = await this.redis.call('JSON.GET', key);
      return Boolean(data);
    } catch (error) {
      console.error('Error checking if session exists in redis', error);
      throw error;
    }
  }

  private createNewSession = async (key: string, value: string): Promise<void> => {
    try {
      await this.redis.call('JSON.SET', key, '.', value);
      console.log(`New session created: ${key}`);
    } catch (error) {
      console.error(`Error creating new session for ${key} in redis`, error);
      throw error;
    }
  }

  private appendRRwebData = async (key: string, value: string): Promise<void> => {
    try {
      await this.redis.call('JSON.ARRAPPEND', key, '.events', value);
      console.log(`#{key} addition events added to redis successfully`);
    } catch (error) {
      console.error(`Error appending events for ${key} in redis`, error);
      throw error;
    }
  }
}
