import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

import psqlRoutes from './routes/psqlRoutes';
import redisRoutes from './routes/redisRoutes';
import s3Routes from './routes/s3Routes';

const app = express();

// Middleware
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// Test routes
app.use('/api/psql', psqlRoutes);
app.use('/api/redis', redisRoutes);
app.use('/api/s3', s3Routes);

export default app;