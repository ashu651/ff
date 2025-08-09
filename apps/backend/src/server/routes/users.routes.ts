import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { getProfile, updateProfile, followUser, unfollowUser, suggestions, savePost, unsavePost, savedPosts, requestFollow, acceptFollowRequest, declineFollowRequest, privacySettings, addToCollection, removeFromCollection, listCollections, pinPost, unpinPost, addCloseFriend, removeCloseFriend, requestVerification } from '../controllers/users.controller.js';

export const router = Router();

router.get('/suggestions', requireAuth, suggestions);
router.get('/saved', requireAuth, savedPosts);
router.post('/saved/:postId', requireAuth, savePost);
router.delete('/saved/:postId', requireAuth, unsavePost);

router.get('/collections', requireAuth, listCollections);
router.post('/collections/:postId', requireAuth, addToCollection);
router.delete('/collections/:postId', requireAuth, removeFromCollection);

router.post('/pin/:postId', requireAuth, pinPost);
router.delete('/pin/:postId', requireAuth, unpinPost);

router.post('/close-friends/:id', requireAuth, addCloseFriend);
router.delete('/close-friends/:id', requireAuth, removeCloseFriend);

router.post('/verification', requireAuth, requestVerification);

router.post('/follow-requests/:requestId/accept', requireAuth, acceptFollowRequest);
router.post('/follow-requests/:requestId/decline', requireAuth, declineFollowRequest);
router.post('/:id/request-follow', requireAuth, requestFollow);

router.get('/me/privacy', requireAuth, privacySettings);
router.put('/me', requireAuth, updateProfile);

router.get('/:username', requireAuth, getProfile);
router.post('/:id/follow', requireAuth, followUser);
router.post('/:id/unfollow', requireAuth, unfollowUser);