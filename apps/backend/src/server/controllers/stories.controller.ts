import { Request, Response } from 'express';
import { z } from 'zod';
import { Story } from '../models/Story.js';
import { User } from '../models/User.js';

const createSchema = z.object({ mediaUrl: z.string().url(), mediaType: z.enum(['image', 'video']), audience: z.enum(['public', 'close_friends']).optional() });

export async function createStory(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const story = await Story.create({ ...parsed.data, user: req.auth!.userId, expiresAt });
  res.status(201).json({ story });
}

export async function listStories(req: Request, res: Response): Promise<void> {
  const me = await User.findById(req.auth!.userId);
  const following = me?.following || [];
  const ids = [me!._id, ...following];
  const stories = await Story.find({ user: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate('user', 'username name avatarUrl closeFriends')
    .lean();
  const filtered = stories.filter((s: any) => s.audience === 'public' || me?.closeFriends?.some((id) => String(id) === String(s.user._id)) || String(s.user._id) === String(me!._id));
  res.json({ stories: filtered });
}