import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { Product } from '../models/Product.js';
import { Subscription } from '../models/Subscription.js';

export const router = Router();

router.post('/products', requireAuth, async (req, res) => {
  const { title, priceCents, imageUrl } = req.body || {};
  const p = await Product.create({ seller: req.auth!.userId, title, priceCents, imageUrl });
  res.status(201).json({ product: p });
});

router.get('/products', async (_req, res) => {
  const items = await Product.find({ inStock: true }).sort({ createdAt: -1 }).lean();
  res.json({ products: items });
});

router.post('/subscribe/:creatorId', requireAuth, async (req, res) => {
  const { tier } = req.body || {};
  const sub = await Subscription.findOneAndUpdate(
    { creator: req.params.creatorId, subscriber: req.auth!.userId },
    { $set: { tier: tier || 'basic', active: true } },
    { upsert: true, new: true }
  );
  res.json({ subscription: sub });
});

router.post('/unsubscribe/:creatorId', requireAuth, async (req, res) => {
  await Subscription.updateOne({ creator: req.params.creatorId, subscriber: req.auth!.userId }, { $set: { active: false } });
  res.json({ ok: true });
});