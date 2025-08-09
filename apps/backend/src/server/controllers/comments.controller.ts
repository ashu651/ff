import { Request, Response } from 'express';
import { z } from 'zod';
import { Comment } from '../models/Comment.js';

const createSchema = z.object({ text: z.string().min(1).max(1000), parentComment: z.string().optional() });

export async function addComment(req: Request, res: Response): Promise<void> {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const comment = await Comment.create({
    post: req.params.postId,
    user: req.auth!.userId,
    text: parsed.data.text,
    parentComment: parsed.data.parentComment || null,
  });
  res.status(201).json({ comment });
}

export async function listComments(req: Request, res: Response): Promise<void> {
  const postId = req.params.postId;
  const comments = await Comment.find({ post: postId }).sort({ createdAt: 1 }).populate('user', 'username avatarUrl').lean();
  res.json({ comments });
}