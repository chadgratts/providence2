import express from 'express';
import { RedisService } from '../services/redisService';
import { PsqlService } from '../services/psqlService';
const router = express.Router();

const redis = new RedisService();
const psql = new PsqlService();

router.post('/record', (req, res) => {
  const { projectID, sessionID, timestamp,events } = req.body;

  // if session doesn't exist (not in postgres)
  if (!redis.sessionExists(sessionID)) {
    psql.addSession(projectID, sessionID, timestamp);
  }

  redis.addRecording(sessionID, events)
})