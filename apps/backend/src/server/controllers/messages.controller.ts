import { Request, Response } from 'express';
import { z } from 'zod';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';

export async function listConversations(req: Request, res: Response): Promise<void> {
  const userId = req.auth!.userId;
  const conversations = await Conversation.find({ members: userId }).sort({ updatedAt: -1 }).populate('members', 'username avatarUrl').lean();
  res.json({ conversations });
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