import { Router } from 'express';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import { requireAuth } from '../middlewares/auth.js';

export const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { name, contentType, contentId, meta } = req.body || {};
  if (!name) return void res.status(400).json({ message: 'name required' });
  await AnalyticsEvent.create({ name, contentType, contentId, user: req.auth!.userId, meta });
  res.status(204).send();
});