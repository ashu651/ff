import { Router } from 'express';
import { User } from '../models/user.model.js';

export const router = Router();

router.post('/users/:id/ban', async (req, res) => {
  await User.updateOne({ _id: req.params.id }, { $set: { 'settings.privateAccount': true, name: '[banned]' } });
  res.json({ ok: true });
});