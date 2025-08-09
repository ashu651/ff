import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { listNotifications, markAllRead } from '../controllers/notifications.controller.js';

export const router = Router();

router.get('/', requireAuth, listNotifications);
router.post('/read-all', requireAuth, markAllRead);