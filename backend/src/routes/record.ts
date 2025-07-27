import express, { Request, Response } from 'express';
import { RedisService } from '../services/redisService';
import { PsqlService } from '../services/psqlService';
const router = express.Router();

const redis = new RedisService();
const psql = new PsqlService();

router.post('/', async (req: Request, res: Response): Promise<void>=> {
  const { projectID, sessionID, timestamp, events } = req.body;
  console.log(req.body);
  const serverTimestamp = new Date().toISOString(); // UTC
  
  try {
    // Check for valid project in PSQL
    const projectMetadata = await psql.getProject(projectID);
    
    if (!projectMetadata) {
      console.log(`Project not found for ${projectID}. Rejecting request.`);
      res.status(400).json({ error: 'Invalid project' });
      return;
    } else {
      console.log(`Valid project ${projectID} found for incoming request`);
    }

    // Check for session metadata in PSQL
    const sessionMetadata = await psql.getActiveSession(sessionID);

    if (!sessionMetadata || sessionMetadata.length === 0) {
      console.log(`Active session not found in PSQL for ${sessionID}. Creating...`);
      await psql.addSession(projectID, sessionID, serverTimestamp);
    } else {
      console.log(`Active session found in PSQL for ${sessionID}. Updating... `);
      await psql.updateSessionMetadata(sessionID, serverTimestamp);
    }

    // Add session event data to Redis
    console.log(`Moving ${events.length} events for session ${sessionID} to Redis...`)
    await redis.addRecording(sessionID, events);

    res.status(200).json({ message: `Events batch for session ${sessionID} processed successfully` });
  } catch (error) {
    console.error(`Error processing batch for session ${sessionID}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router