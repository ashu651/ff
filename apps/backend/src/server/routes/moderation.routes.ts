import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { report } from '../controllers/moderation.controller.js';

export const router = Router();

router.post('/report', requireAuth, report);