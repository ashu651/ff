import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';

export async function getProfile(req: Request, res: Response): Promise<void> {
  const username = req.params.username?.toLowerCase();
  const user = await User.findOne({ username }).select('-passwordHash');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ user });
}

const updateSchema = z.object({ name: z.string().min(1).max(50).optional(), bio: z.string().max(160).optional(), avatarUrl: z.string().url().optional() });

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const user = await User.findByIdAndUpdate(req.auth!.userId, parsed.data, { new: true }).select('-passwordHash');
  res.json({ user });
}

export async function followUser(req: Request, res: Response): Promise<void> {
  const targetId = req.params.id;
  const me = req.auth!.userId;
  if (me === targetId) {
    res.status(400).json({ message: 'Cannot follow yourself' });
    return;
  }
  await User.findByIdAndUpdate(me, { $addToSet: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $addToSet: { followers: me } });
  res.json({ ok: true });
}

export async function unfollowUser(req: Request, res: Response): Promise<void> {
  const targetId = req.params.id;
  const me = req.auth!.userId;
  await User.findByIdAndUpdate(me, { $pull: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { followers: me } });
  res.json({ ok: true });
}

export async function suggestions(req: Request, res: Response): Promise<void> {
  const me = req.auth!.userId;
  const meDoc = await User.findById(me);
  const notIn = [me, ...(meDoc?.following || []).map((id) => id.toString())];
  const users = await User.find({ _id: { $nin: notIn } }).select('username name avatarUrl').limit(10).lean();
  res.json({ users });
}