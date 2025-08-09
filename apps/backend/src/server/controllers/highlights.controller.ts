import { Request, Response } from 'express';
import { Highlight } from '../models/Highlight.js';

export async function createHighlight(req: Request, res: Response): Promise<void> {
  const { title, coverUrl } = req.body || {};
  if (!title) return void res.status(400).json({ message: 'Title required' });
  const highlight = await Highlight.create({ user: req.auth!.userId, title, coverUrl, stories: [] });
  res.status(201).json({ highlight });
}

export async function addToHighlight(req: Request, res: Response): Promise<void> {
  const { highlightId, storyId } = req.params;
  await Highlight.updateOne({ _id: highlightId, user: req.auth!.userId }, { $addToSet: { stories: storyId } });
  res.json({ ok: true });
}

export async function listHighlights(req: Request, res: Response): Promise<void> {
  const items = await Highlight.find({ user: req.auth!.userId }).sort({ createdAt: -1 }).lean();
  res.json({ highlights: items });
}