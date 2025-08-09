import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createPost, feed, likePost, unlikePost, userPosts } from '../controllers/posts.controller.js';

export const router = Router();

router.get('/feed', requireAuth, feed);
router.get('/user/:username', requireAuth, userPosts);
router.post('/', requireAuth, createPost);
router.post('/:id/like', requireAuth, likePost);
router.post('/:id/unlike', requireAuth, unlikePost);