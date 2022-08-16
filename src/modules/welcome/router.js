import { Router } from 'express';

const router = Router();

router.get('/', ( _req, res) => {
  res.status(200).json({ message: 'Hello World' });
});

router.get('/healthCheck/ping', ( _req, res) => {
  res.status(200).json({ message: 'PONG' });
});

export default router;
