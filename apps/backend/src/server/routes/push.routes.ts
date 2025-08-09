import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { PushSubscription } from '../models/PushSubscription.js';
import webpush from 'web-push';

export const router = Router();

webpush.setVapidDetails('mailto:admin@snapzy.app', process.env.VAPID_PUBLIC_KEY || '', process.env.VAPID_PRIVATE_KEY || '');

router.post('/subscribe', requireAuth, async (req, res) => {
  const sub = req.body;
  await PushSubscription.updateOne({ endpoint: sub.endpoint }, { $set: { user: req.auth!.userId, keys: sub.keys } }, { upsert: true });
  res.status(201).json({ ok: true });
});

router.post('/unsubscribe', requireAuth, async (req, res) => {
  const { endpoint } = req.body || {};
  await PushSubscription.deleteOne({ endpoint });
  res.json({ ok: true });
});

router.post('/test', requireAuth, async (_req, res) => {
  const subs = await PushSubscription.find({ user: _req.auth!.userId }).lean();
  await Promise.allSettled(
    subs.map((s) => webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys } as any, JSON.stringify({ title: 'Snapzy', body: 'Push enabled!' })))
  );
  res.json({ ok: true });
});