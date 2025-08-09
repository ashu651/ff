import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middlewares/auth.js';
import cloudinary from '../config/cloudinary.js';

const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } });

export const router = Router();

router.post('/image', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, { folder: 'snapzy', resource_type: 'image' });
    res.json({ url: result.secure_url, width: result.width, height: result.height });
  } catch (err) {
    next(err);
  }
});

router.post('/video', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, { folder: 'snapzy', resource_type: 'video' });
    res.json({ url: result.secure_url, duration: result.duration });
  } catch (err) {
    next(err);
  }
});