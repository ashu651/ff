import { Request, Response } from 'express';
import { Notification } from '../models/Notification.js';

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const userId = req.auth!.userId;
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50).populate('fromUser', 'username avatarUrl').lean();
  res.json({ notifications });
}

export async function markAllRead(req: Request, res: Response): Promise<void> {
  const userId = req.auth!.userId;
  await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
  res.json({ ok: true });
}