import { Router } from 'express';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';

export const router = Router();

router.get('/users', async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) return res.json({ users: [] });
  const users = await User.find({ $or: [{ username: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] }).select('username name avatar.url').limit(10).lean();
  res.json({ users });
});

router.get('/hashtags', async (req, res) => {
  const q = String(req.query.q || '').replace(/^#/, '').trim();
  if (!q) return res.json({ hashtags: [] });
  const posts = await Post.find({ hashtags: new RegExp(`^${q}`, 'i') }).select('hashtags').limit(50).lean();
  const set = new Set<string>();
  posts.forEach((p) => p.hashtags?.forEach((h) => set.add(h)));
  res.json({ hashtags: Array.from(set).slice(0, 20) });
});