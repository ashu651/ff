import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { FollowRequest } from '../models/FollowRequest.js';

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

export async function savePost(req: Request, res: Response): Promise<void> {
  const postId = req.params.postId;
  await User.findByIdAndUpdate(req.auth!.userId, { $addToSet: { savedPosts: postId } });
  res.json({ ok: true });
}

export async function unsavePost(req: Request, res: Response): Promise<void> {
  const postId = req.params.postId;
  await User.findByIdAndUpdate(req.auth!.userId, { $pull: { savedPosts: postId } });
  res.json({ ok: true });
}

export async function savedPosts(req: Request, res: Response): Promise<void> {
  const me = await User.findById(req.auth!.userId).lean();
  const posts = await Post.find({ _id: { $in: me?.savedPosts || [] } }).sort({ createdAt: -1 }).lean();
  res.json({ posts });
}

export async function requestFollow(req: Request, res: Response): Promise<void> {
  const toUser = await User.findById(req.params.id).lean();
  if (!toUser) return void res.status(404).json({ message: 'User not found' });
  if (!toUser.isPrivate) {
    // auto-follow if public
    await User.findByIdAndUpdate(req.auth!.userId, { $addToSet: { following: toUser._id } });
    await User.findByIdAndUpdate(toUser._id, { $addToSet: { followers: req.auth!.userId } });
    return void res.json({ ok: true, followed: true });
  }
  const fr = await FollowRequest.findOneAndUpdate(
    { fromUser: req.auth!.userId, toUser: toUser._id },
    { $setOnInsert: { status: 'pending' } },
    { new: true, upsert: true }
  );
  res.json({ request: fr });
}

export async function acceptFollowRequest(req: Request, res: Response): Promise<void> {
  const fr = await FollowRequest.findById(req.params.requestId);
  if (!fr || String(fr.toUser) !== req.auth!.userId) return void res.status(404).json({ message: 'Not found' });
  fr.status = 'accepted';
  await fr.save();
  await User.findByIdAndUpdate(fr.fromUser, { $addToSet: { following: fr.toUser } });
  await User.findByIdAndUpdate(fr.toUser, { $addToSet: { followers: fr.fromUser } });
  res.json({ ok: true });
}

export async function declineFollowRequest(req: Request, res: Response): Promise<void> {
  const fr = await FollowRequest.findById(req.params.requestId);
  if (!fr || String(fr.toUser) !== req.auth!.userId) return void res.status(404).json({ message: 'Not found' });
  fr.status = 'declined';
  await fr.save();
  res.json({ ok: true });
}

export async function privacySettings(req: Request, res: Response): Promise<void> {
  const me = await User.findById(req.auth!.userId).select('isPrivate closeFriends blockedUsers mutedUsers verified').lean();
  res.json({ settings: me });
}