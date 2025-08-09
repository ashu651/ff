import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { createStory, listStories } from '../controllers/stories.controller.js';
import { addStoryPoll, voteStoryPoll } from '../controllers/storyPolls.controller.js';
import { createHighlight, addToHighlight, listHighlights } from '../controllers/highlights.controller.js';

export const router = Router();

router.get('/', requireAuth, listStories);
router.post('/', requireAuth, createStory);

router.post('/:storyId/poll', requireAuth, addStoryPoll);
router.post('/:storyId/poll/vote', requireAuth, voteStoryPoll);

router.get('/highlights', requireAuth, listHighlights);
router.post('/highlights', requireAuth, createHighlight);
router.post('/highlights/:highlightId/:storyId', requireAuth, addToHighlight);