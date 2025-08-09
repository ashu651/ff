import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getProfile, updateProfile, followUser, unfollowUser, suggestions, savePost, unsavePost, savedPosts, requestFollow, acceptFollowRequest, declineFollowRequest, privacySettings } from '../controllers/users.controller.js';

export const router = Router();

router.get('/suggestions', requireAuth, suggestions);
router.get('/saved', requireAuth, savedPosts);
router.post('/saved/:postId', requireAuth, savePost);
router.delete('/saved/:postId', requireAuth, unsavePost);

router.post('/follow-requests/:requestId/accept', requireAuth, acceptFollowRequest);
router.post('/follow-requests/:requestId/decline', requireAuth, declineFollowRequest);
router.post('/:id/request-follow', requireAuth, requestFollow);

router.get('/me/privacy', requireAuth, privacySettings);
router.put('/me', requireAuth, updateProfile);

router.get('/:username', requireAuth, getProfile);
router.post('/:id/follow', requireAuth, followUser);
router.post('/:id/unfollow', requireAuth, unfollowUser);