import { Request, Response } from 'express';
import { Post } from '../models/Post.js';
import { Hashtag } from '../models/Hashtag.js';
import { getRedis } from '../services/redis.js';

export async function trending(_req: Request, res: Response): Promise<void> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const posts = await Post.find({ createdAt: { $gte: since }, isPublished: true })
    .sort({ likes: -1, createdAt: -1 })
    .limit(30)
    .lean();
  res.json({ posts });
}

export async function trendingHashtags(_req: Request, res: Response): Promise<void> {
  const tags = await Hashtag.find({}).sort({ postsCount: -1, updatedAt: -1 }).limit(20).lean();
  res.json({ hashtags: tags });
}

export async function recommendations(req: Request, res: Response): Promise<void> {
  const redis = getRedis();
  const key = `rec:user:${req.auth!.userId}`;
  const ids = await redis.zrevrange(key, 0, 49);
  let posts = [] as any[];
  if (ids.length) {
    posts = await Post.find({ _id: { $in: ids }, isPublished: true }).limit(50).lean();
  } else {
    posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 }).limit(50).lean();
  }
  res.json({ posts });
}