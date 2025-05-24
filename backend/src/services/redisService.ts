import Redis from 'ioredis'; // NPM package providing redis functionality
import config from '../config/environment';

// Provides functionality to interact with the redis database.
export class RedisService {
  private connection: Redis;

  constructor() {
    if (!config.REDIS.URL) {
      throw new Error('Redis URL is not configured');
    }
    this.connection = new Redis(config.REDIS.URL);
  }

  // Pull recording data from redis
  async getRecording(key: string): Promise<string | null> {
    try {
      const data = await this.connection.call('JSON.GET', key);
      if (data === null) return null;
      if (typeof data !== 'string') {
        throw new Error('Invalid data type returned from Redis');
      }
      return data;
    } catch (error) {
      console.error('Redis recording data fetch error:', error);
      throw error;
    }
  }

  // Add recording data to redis. If key exists, append data. If not, create it
  async addRecording(key: string, value: string): Promise<void> {
    const keyExists = await this.sessionExists(key);
    if (keyExists) {
      await this.appendRecording(key, value);
    } else {
      await this.createRecording(key, value);
    }
  }

  // Does the key exist?
  async sessionExists(key: string): Promise<boolean> {
    try {
      const data = await this.connection.call('JSON.GET', key);
      return !!data;
    } catch (error) {
      console.error('Redis session fetch error:', error);
      throw error;
    }
  }

  async deleteRecording(key:string): Promise<void> {
    try {
      await this.connection.call('JSON.DEL', key)
      console.log(`${key} deleted from redis sucessfully`)
    } catch (error) {
      console.error(`Error delete key ${key} from redis`, error)
      throw error;
    }
  }

  // Private method only to be called by addRecording
  private async appendRecording(key: string, value: string): Promise<void> {
    try {
      await this.connection.call('JSON.ARRAPPEND', key, '.', value);
      console.log(`${key} additional events added to redis successfully`);
    } catch (error) {
      console.error(`Error appending events for ${key} in redis`, error);
      throw error;
    }
  }

  // Private method only to be called by addRecording
  private async createRecording(key: string, value: string): Promise<void> {
    try {
      await this.connection.call('JSON.SET', key, '.', value);
      console.log(`${key} created and events added to redis successfully`);
    } catch (error) {
      console.error(`Error adding key and events for ${key} in redis`, error);
      throw error;
    }
  }
}