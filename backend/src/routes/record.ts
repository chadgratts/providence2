import express from 'express';
import { RedisService } from '../services/redisService';
import { PsqlService } from '../services/psqlService';

const router = express.Router();

const redis = new RedisService();
const psql = new PsqlService();

router.post('/', async (req, res) => {
  console.log('POST /record');
  try {
    const { project_id, session_id, timestamp, events } = req.body;
    const sessionExists = await redis.sessionExists(session_id);

    if (!sessionExists) {
      await psql.addSession(project_id, session_id, new Date().toISOString());
    }

    await redis.addSession(session_id, JSON.stringify(events));
    res.status(201).send('Session recorded');
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

export default router;