import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { addComment, listComments } from '../controllers/comments.controller.js';

export const router = Router();

router.get('/:postId', requireAuth, listComments);
router.post('/:postId', requireAuth, addComment);