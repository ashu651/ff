import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { Notification } from '../models/notification.model.js';

export const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const items = await Notification.find({ user: req.auth!.userId }).sort({ createdAt: -1 }).limit(50).populate('sourceUser', 'username');
  res.json({ notifications: items });
});

router.post('/mark-read', requireAuth, async (req, res) => {
  await Notification.updateMany({ user: req.auth!.userId, read: false }, { $set: { read: true } });
  res.json({ ok: true });
});