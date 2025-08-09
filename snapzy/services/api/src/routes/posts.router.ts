import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createPost, getPost, feed } from '../controllers/posts.controller.js';

export const router = Router();

router.get('/feed', requireAuth, feed);
router.get('/:id', getPost);
router.post('/', requireAuth, createPost);