import { Router } from 'express';
import { Post } from '../models/post.model.js';

export const router = Router();

router.get('/trending', async (_req, res) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const posts = await Post.find({ createdAt: { $gte: since }, visibility: 'public' }).sort({ likesCount: -1, commentsCount: -1, createdAt: -1 }).limit(30).lean();
  res.json({ posts });
});