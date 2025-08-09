import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { signUpload } from '../services/cloudinary.service.js';

export const router = Router();

router.get('/sign', requireAuth, (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = (req.query.folder as string) || 'posts';
  const params = { timestamp, folder } as Record<string, string | number>;
  const signature = signUpload(params);
  res.json({
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    timestamp,
    folder,
    signature,
  });
});