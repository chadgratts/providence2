import express from 'express';
import { RedisService } from '../services/redisService';
import { PsqlService } from '../services/psqlService';

const router = express.Router();

const redis = new RedisService();
const psql = new PsqlService();

router.post('/', async (req, res) => {
  try {
    const { project_id, session_id, timestamp, events } = req.body;

    const serverTimestamp = new Date().toISOString();
    const projectMetadata = await psql.getProject(project_id);

    if (!projectMetadata) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const sessionMetadata = await psql.getSession(session_id);

    if (sessionMetadata) {
      await psql.updateSessionMetadata(session_id, serverTimestamp); // changed from activity to metadata
    } else {
      await psql.addSession(session_id, project_id, serverTimestamp);
    }

    await redis.addSession(session_id, JSON.stringify(events));

    res.status(201).json({ message: 'Session processed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

export default router;