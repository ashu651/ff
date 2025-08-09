import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { trending, trendingHashtags } from '../controllers/explore.controller.js';

export const router = Router();

router.get('/trending', requireAuth, trending);
router.get('/hashtags', requireAuth, trendingHashtags);