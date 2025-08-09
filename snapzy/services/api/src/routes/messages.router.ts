import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { Conversation } from '../models/conversation.model.js';

export const router = Router();

router.get('/conversation/:otherUserId', requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  const other = req.params.otherUserId;
  let conv = await Conversation.findOne({ participants: { $all: [userId, other] } });
  if (!conv) conv = await Conversation.create({ participants: [userId, other], messages: [] });
  res.json({ conversation: conv });
});

router.post('/:otherUserId', requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  const other = req.params.otherUserId;
  const { text, media } = req.body || {};
  let conv = await Conversation.findOne({ participants: { $all: [userId, other] } });
  if (!conv) conv = await Conversation.create({ participants: [userId, other], messages: [] });
  conv.messages.push({ sender: userId as any, text, media, read: false, createdAt: new Date() } as any);
  conv.lastUpdated = new Date();
  await conv.save();
  res.status(201).json({ conversation: conv });
});