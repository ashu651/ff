import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

export async function search(req: Request, res: Response): Promise<void> {
  const q = String(req.query.q || '').trim();
  if (!q) {
    res.json({ users: [], posts: [] });
    return;
  }
  const users = await User.find({ $or: [{ username: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] })
    .select('username name avatarUrl')
    .limit(10)
    .lean();
  const posts = await Post.find({ $text: { $search: q } }).limit(10).lean();
  res.json({ users, posts });
}