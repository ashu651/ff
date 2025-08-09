import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createStory, listStories } from '../controllers/stories.controller.js';

export const router = Router();

router.get('/', requireAuth, listStories);
router.post('/', requireAuth, createStory);