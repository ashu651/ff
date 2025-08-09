import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    const cookieToken = req.cookies?.access_token as string | undefined;
    const jwtToken = token || cookieToken;

    if (!jwtToken) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = jwt.verify(jwtToken, process.env.JWT_ACCESS_SECRET as string) as AuthPayload;
    req.auth = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}