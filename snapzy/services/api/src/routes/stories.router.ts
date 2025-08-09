import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { Story } from '../models/story.model.js';

export const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { media } = req.body || {};
  if (!media?.url || !media?.publicId || !media?.type) return res.status(400).json({ message: 'Invalid story' });
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const story = await Story.create({ author: req.auth!.userId, media, expiresAt });
  res.status(201).json({ story });
});

router.get('/:userId', requireAuth, async (req, res) => {
  const items = await Story.find({ author: req.params.userId }).sort({ createdAt: -1 });
  res.json({ stories: items });
});