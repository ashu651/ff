import { Request, Response } from 'express';
import { Post } from '../models/Post.js';
import { Hashtag } from '../models/Hashtag.js';

export async function trending(_req: Request, res: Response): Promise<void> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const posts = await Post.find({ createdAt: { $gte: since } })
    .sort({ likes: -1, createdAt: -1 })
    .limit(30)
    .lean();
  res.json({ posts });
}

export async function trendingHashtags(_req: Request, res: Response): Promise<void> {
  const tags = await Hashtag.find({}).sort({ postsCount: -1, updatedAt: -1 }).limit(20).lean();
  res.json({ hashtags: tags });
}