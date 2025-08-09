import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { trending, trendingHashtags, recommendations } from '../controllers/explore.controller.js';

export const router = Router();

router.get('/trending', requireAuth, trending);
router.get('/hashtags', requireAuth, trendingHashtags);
router.get('/recommendations', requireAuth, recommendations);