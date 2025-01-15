import { Request, Response } from 'express';
import { RedisService } from '../services/redisService';
// import { OpenAIService } from '../services/openAIService';

export class RedisController {
  private redisService: RedisService;

  constructor() {
    this.redisService = new RedisService();
    // this.openAIService = new OpenAIService();
    console.log('RedisController constructor');
  }

  addSession = async (req: Request, res: Response): Promise<void> => {
    const { key, data } = req.body;
    try {
      await this.redisService.setSession(key, data);
      res.status(200).json({ message: `Your data ${data} was stored :)` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save datat' });
    }
  };

  getAndSummarizeSession = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const data = await this.redisService.getSession(id);
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}