import { Router } from 'express';

const router = Router();

router.get('api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

export default router;