import { Router } from 'express';
import { login, logout, refresh, register, me, forgotPassword, resetPassword, twofaSetup, twofaEnable, twofaDisable, sessions, revokeSession } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.js';

export const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', requireAuth, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/2fa/setup', requireAuth, twofaSetup);
router.post('/2fa/enable', requireAuth, twofaEnable);
router.post('/2fa/disable', requireAuth, twofaDisable);

router.get('/sessions', requireAuth, sessions);
router.delete('/sessions/:id', requireAuth, revokeSession);