import { Router } from 'express';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';

export const router = Router();

router.get('/reports', async (_req, res) => {
  const items = await Report.find({ status: 'open' }).sort({ createdAt: -1 }).lean();
  res.json({ reports: items });
});

router.post('/reports/:id/status', async (req, res) => {
  const { status } = req.body || {};
  await Report.updateOne({ _id: req.params.id }, { $set: { status } });
  res.json({ ok: true });
});

router.get('/verification', async (_req, res) => {
  const users = await User.find({ 'verificationRequest.status': 'pending' }).select('username verificationRequest').lean();
  res.json({ users });
});

router.post('/verification/:userId', async (req, res) => {
  const { status } = req.body || {};
  await User.updateOne({ _id: req.params.userId }, { $set: { verificationRequest: { status }, verified: status === 'approved' } });
  res.json({ ok: true });
});