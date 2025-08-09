import { Router, Request } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { Comment } from '../models/comment.model.js';

type PostParams = { id: string };

export const router = Router({ mergeParams: true });

router.get('/', async (req: Request<PostParams>, res) => {
  const postId = req.params.id as string;
  const items = await Comment.find({ post: postId }).sort({ createdAt: 1 }).populate('author', 'username');
  res.json({ comments: items });
});

router.post('/', requireAuth, async (req: Request<PostParams>, res) => {
  const postId = req.params.id as string;
  const { text, parentComment } = (req.body || {}) as { text?: string; parentComment?: string };
  if (!text) return res.status(400).json({ message: 'Text required' });
  const c = await Comment.create({ post: postId, author: req.auth!.userId as any, text, parentComment: parentComment || null });
  res.status(201).json({ comment: c });
});