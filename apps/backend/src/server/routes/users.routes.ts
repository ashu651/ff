import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getProfile, updateProfile, followUser, unfollowUser, suggestions } from '../controllers/users.controller.js';

export const router = Router();

router.get('/suggestions', requireAuth, suggestions);
router.get('/:username', requireAuth, getProfile);
router.put('/me', requireAuth, updateProfile);
router.post('/:id/follow', requireAuth, followUser);
router.post('/:id/unfollow', requireAuth, unfollowUser);