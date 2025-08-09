import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createPost, getPost, feed, like, unlike } from '../controllers/posts.controller.js';
import { router as commentsRouter } from './comments.router.js';

export const router = Router();

router.get('/feed', requireAuth, feed);
router.get('/:id', getPost);
router.post('/', requireAuth, createPost);
router.post('/:id/like', requireAuth, like);
router.delete('/:id/like', requireAuth, unlike);
router.use('/:id/comments', commentsRouter);