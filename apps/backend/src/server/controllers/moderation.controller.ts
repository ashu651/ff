import { Request, Response } from 'express';
import { Report } from '../models/Report.js';

export async function report(req: Request, res: Response): Promise<void> {
  const { targetUser, targetPost, reason } = req.body || {};
  if (!reason) return void res.status(400).json({ message: 'Reason required' });
  const created = await Report.create({ reporter: req.auth!.userId, targetUser: targetUser || null, targetPost: targetPost || null, reason });
  res.status(201).json({ report: created });
}