import { Request, Response } from 'express';
import { RedisService } from '../services/redisService';
import { OpenAIService } from '../services/openAIService';

export class RedisController {
  private redisService: RedisService;
  private openAIService: OpenAIService;

  constructor() {
    this.redisService = new RedisService();
    this.openAIService = new OpenAIService();
  }

  addSession = async (req: Request, res: Response): Promise<void> => {
    const { key, data } = req.body;
    try {
      await this.redisService.addSession(key, JSON.stringify(data));
      res.status(200).json({ message: `Your data ${data} was stored :)` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  };

  getAndSummarizeSession = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
      const data = await this.redisService.getSession(id); // "8 spruce"
      if (data) {
        // const summary = await this.openAIService.summarizeSession(data);
        res.send(data);
      } else {
        res.status(404).json({ error: 'Recording not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}