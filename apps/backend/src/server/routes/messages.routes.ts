import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { listConversations, listMessages, sendMessage, createConversation, markRead } from '../controllers/messages.controller.js';

export const router = Router();

router.get('/conversations', requireAuth, listConversations);
router.post('/conversations', requireAuth, createConversation);
router.get('/conversations/:conversationId', requireAuth, listMessages);
router.post('/conversations/:conversationId', requireAuth, sendMessage);
router.post('/conversations/:conversationId/read', requireAuth, markRead);