import express from 'express';
import { RedisService } from '../services/redisService';
import { PsqlService } from '../services/psqlService';
const router = express.Router();

const redis = new RedisService();
const psql = new PsqlService();

router.post('/record', async (req, res) => {
  const { projectID, sessionID, timestamp, events } = req.body;
  const serverTimestamp = new Date().toISOString(); // UTC
  
  try {
    // Check for valid project in PSQL
    const projectMetadata = await psql.getProject(projectID);
    
    if (!projectMetadata) {
      return res.status(400).json({ error: 'Invalid project' });
    }

    // Check for session metadata in PSQL
    const sessionMetadata = await psql.getSession(sessionID);

    if (!sessionMetadata) {
      await psql.addSession(sessionID, projectID, serverTimestamp);
    } else {
      await psql.updateSessionMetadata(sessionID, serverTimestamp);
    }

    // Add session event data to Redis
    await redis.addRecording(sessionID, JSON.stringify(events));

    res.status(200).json({ message: 'Events batch processed successfully' });
  } catch (error) {
    console.error('Error processing batch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.ts --> routes -->  controllers --> services

//
//
// CREATE TABLE sessions (
//   id SERIAL PRIMARY KEY,
//   project_id INTEGER NOT NULL,
//   session_id VARCHAR(255),
//   events_file_name VARCHAR (255) NOT NULL,
//   session_summary VARCHAR (5000),                           
//   session_start TIMESTAMP NOT NULL,
//   session_end TIMESTAMP,
//   CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id)
// );
//  CREATE TABLE projects (
//    id SERIAL PRIMARY KEY, 
//    name VARCHAR(255) NOT NULL,
//    password_hash VARCHAR(255)
// );

// CREATE DATABASE heimdall 