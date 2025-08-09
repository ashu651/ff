import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { AccountLink } from '../models/AccountLink.js';

export const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const doc = await AccountLink.findOne({ owner: req.auth!.userId }).populate('accounts', 'username avatarUrl').lean();
  res.json({ links: doc?.accounts || [] });
});

router.post('/link', requireAuth, async (req, res) => {
  const userId = String(req.body.userId || '');
  await AccountLink.updateOne({ owner: req.auth!.userId }, { $addToSet: { accounts: userId } }, { upsert: true });
  res.json({ ok: true });
});

router.post('/unlink', requireAuth, async (req, res) => {
  const userId = String(req.body.userId || '');
  await AccountLink.updateOne({ owner: req.auth!.userId }, { $pull: { accounts: userId } });
  res.json({ ok: true });
});