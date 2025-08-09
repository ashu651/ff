import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { listConversations, listMessages, sendMessage } from '../controllers/messages.controller.js';

export const router = Router();

router.get('/conversations', requireAuth, listConversations);
router.get('/conversations/:conversationId', requireAuth, listMessages);
router.post('/conversations/:conversationId', requireAuth, sendMessage);