import { Request, Response } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

const createSchema = z.object({
  caption: z.string().max(2200).optional(),
  mediaUrl: z.string().url(),
  mediaType: z.enum(['image', 'video']),
  tags: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
});

export async function createPost(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data', details: parsed.error.flatten() });
    return;
  }
  const created = await Post.create({ ...parsed.data, user: req.auth!.userId });
  res.status(201).json({ post: created });
}

export async function feed(req: Request, res: Response): Promise<void> {
  const me = await User.findById(req.auth!.userId);
  const following = me?.following || [];
  const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : new Date();
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const posts = await Post.find({ user: { $in: [me!._id, ...following] }, createdAt: { $lt: cursor } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'username name avatarUrl')
    .lean();

  const nextCursor = posts.length ? posts[posts.length - 1].createdAt.toISOString() : null;
  res.json({ posts, nextCursor });
}

export async function userPosts(req: Request, res: Response): Promise<void> {
  const username = req.params.username.toLowerCase();
  const user = await User.findOne({ username });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 }).lean();
  res.json({ posts });
}

export async function likePost(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  await Post.findByIdAndUpdate(id, { $addToSet: { likes: req.auth!.userId } });
  res.json({ ok: true });
}

export async function unlikePost(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  await Post.findByIdAndUpdate(id, { $pull: { likes: req.auth!.userId } });
  res.json({ ok: true });
}