import { Request, Response } from 'express';
import { z } from 'zod';
import { Post } from '../models/post.model.js';

const createSchema = z.object({
  caption: z.string().max(2200).optional(),
  media: z.array(z.object({ url: z.string().url(), publicId: z.string(), type: z.enum(['image', 'video']), width: z.number().optional(), height: z.number().optional(), duration: z.number().optional() })).min(1),
  hashtags: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'private']).optional(),
});

export async function createPost(req: Request, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid data' });
  const post = await Post.create({ ...parsed.data, author: req.auth!.userId, likesCount: 0, commentsCount: 0 });
  res.status(201).json({ post });
}

export async function getPost(req: Request, res: Response) {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json({ post });
}

export async function feed(req: Request, res: Response) {
  const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : new Date();
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const posts = await Post.find({ createdAt: { $lt: cursor }, visibility: 'public' }).sort({ createdAt: -1 }).limit(limit).populate('author', 'username').lean();
  const nextCursor = posts.length ? posts[posts.length - 1].createdAt.toISOString() : null;
  res.json({ posts, nextCursor });
}