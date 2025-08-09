import { Request, Response } from 'express';
import { Story } from '../models/Story.js';

export async function addStoryPoll(req: Request, res: Response): Promise<void> {
  const storyId = req.params.storyId;
  const { question, options } = req.body || {};
  if (!question || !Array.isArray(options) || options.length < 2) {
    return void res.status(400).json({ message: 'Invalid poll' });
  }
  const poll = { question, options: options.map((label: string) => ({ label, votes: 0 })) };
  await Story.updateOne({ _id: storyId, user: req.auth!.userId }, { $set: { poll } });
  res.json({ ok: true });
}

export async function voteStoryPoll(req: Request, res: Response): Promise<void> {
  const storyId = req.params.storyId;
  const { index } = req.body || {};
  const story = await Story.findById(storyId);
  if (!story?.poll || typeof index !== 'number' || index < 0 || index >= story.poll.options.length) {
    return void res.status(400).json({ message: 'Invalid vote' });
  }
  story.poll.options[index].votes += 1;
  await story.save();
  res.json({ ok: true, poll: story.poll });
}