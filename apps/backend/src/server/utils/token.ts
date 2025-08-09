import jwt, { SignOptions, Secret } from 'jsonwebtoken';

export function generateAccessToken(userId: string): string {
  const options: SignOptions = { expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as any };
  return jwt.sign({ userId }, (process.env.JWT_ACCESS_SECRET as unknown) as Secret, options);
}

export function generateRefreshToken(userId: string): string {
  const options: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES || '7d') as any };
  return jwt.sign({ userId }, (process.env.JWT_REFRESH_SECRET as unknown) as Secret, options);
}