import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { search } from '../controllers/search.controller.js';

export const router = Router();

router.get('/', requireAuth, search);