import { Request, Response } from 'express';
import { z } from 'zod';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';
import { Hashtag } from '../models/Hashtag.js';

const mediaItem = z.object({ url: z.string().url(), type: z.enum(['image', 'video']), thumbnailUrl: z.string().url().optional() });
const createSchema = z.object({
  caption: z.string().max(2200).optional(),
  mediaUrl: z.string().url().optional(), // backward compat
  mediaType: z.enum(['image', 'video']).optional(),
  media: z.array(mediaItem).optional(),
  tags: z.array(z.string()).optional().default([]),
  userTags: z.array(z.string()).optional().default([]),
  location: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export async function createPost(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data', details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data as any;
  const hashtags = new Set<string>((data.tags || []).map((t: string) => t.replace(/^#/, '').toLowerCase()));
  if (data.caption) {
    for (const match of data.caption.matchAll(/#(\w+)/g)) hashtags.add(match[1].toLowerCase());
  }
  const scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  const isPublished = !scheduledAt || scheduledAt <= new Date();
  const created = await Post.create({
    user: req.auth!.userId,
    caption: data.caption,
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    media: data.media || (data.mediaUrl && data.mediaType ? [{ url: data.mediaUrl, type: data.mediaType }] : []),
    tags: Array.from(hashtags),
    userTags: data.userTags,
    location: data.location,
    scheduledAt,
    isPublished,
  });

  const ops = Array.from(hashtags).map((name) =>
    Hashtag.updateOne({ name }, { $inc: { postsCount: 1 } }, { upsert: true }).exec()
  );
  void Promise.allSettled(ops);

  res.status(201).json({ post: created });
}

export async function feed(req: Request, res: Response): Promise<void> {
  const me = await User.findById(req.auth!.userId);
  const following = me?.following || [];
  const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : new Date();
  const limit = Math.min(Number(req.query.limit) || 10, 50);

  const posts = await Post.find({ user: { $in: [me!._id, ...following] }, createdAt: { $lt: cursor }, isPublished: true })
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