import { Request, Response } from 'express';
import { z } from 'zod';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export async function listConversations(req: Request, res: Response): Promise<void> {
  const userId = req.auth!.userId;
  const conversations = await Conversation.find({ members: userId }).sort({ updatedAt: -1 }).populate('members', 'username avatarUrl').lean();
  res.json({ conversations });
}

export async function createConversation(req: Request, res: Response): Promise<void> {
  const otherId = String(req.body.userId || '');
  if (!otherId) return void res.status(400).json({ message: 'userId required' });
  let conv = await Conversation.findOne({ members: { $all: [req.auth!.userId, otherId] } });
  if (!conv) conv = await Conversation.create({ members: [req.auth!.userId, otherId] });
  res.status(201).json({ conversation: conv });
}

export async function listMessages(req: Request, res: Response): Promise<void> {
  const conversationId = req.params.conversationId;
  const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  res.json({ messages });
}

const sendSchema = z.object({ text: z.string().optional(), mediaUrl: z.string().url().optional() });

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const conversationId = req.params.conversationId;
  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success || (!parsed.data.text && !parsed.data.mediaUrl)) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const message = await Message.create({ conversation: conversationId, sender: req.auth!.userId, ...parsed.data });
  await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });
  res.status(201).json({ message });
}

export async function markRead(req: Request, res: Response): Promise<void> {
  const conversationId = req.params.conversationId;
  await Message.updateMany({ conversation: conversationId, readAt: null, sender: { $ne: req.auth!.userId } }, { $set: { readAt: new Date() } });
  res.json({ ok: true });
}