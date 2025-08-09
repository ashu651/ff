import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload { userId: string }

declare global {
  namespace Express { interface Request { auth?: AuthPayload } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const bearer = req.headers.authorization;
    const token = bearer?.startsWith('Bearer ') ? bearer.split(' ')[1] : req.cookies?.access_token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
    req.auth = { userId: decoded.userId };
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
}