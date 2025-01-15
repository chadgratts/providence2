import express from 'express';
import { RedisController } from '../controllers/redisController';

const router = express.Router();
const redisController = new RedisController();

router.get('/:id', redisController.getAndSummarizeSession);
router.post('/', redisController.addSession);

export default router;