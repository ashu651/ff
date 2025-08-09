import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const registerSchema = z.object({
  username: z.string().min(3).max(20).toLowerCase(),
  email: z.string().email().toLowerCase(),
  name: z.string().min(1).max(50),
  password: z.string().min(6),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data', details: parsed.error.flatten() });
    return;
  }
  const { username, email, name, password } = parsed.data;
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) {
    res.status(409).json({ message: 'Username or email already exists' });
    return;
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({ username, email, name, passwordHash });
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(201).json({ user: serializeUser(user) });
}

const loginSchema = z.object({ identifier: z.string(), password: z.string() });

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const { identifier, password } = parsed.data;
  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
  });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  setAuthCookies(res, accessToken, refreshToken);
  res.json({ user: serializeUser(user) });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(204).send();
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const jwt = await import('jsonwebtoken');
  const token = req.cookies?.refresh_token as string | undefined;
  if (!token) {
    res.status(401).json({ message: 'No refresh token' });
    return;
  }
  try {
    const decoded = jwt.default.verify(token, process.env.JWT_REFRESH_SECRET as string) as { userId: string };
    const newAccess = generateAccessToken(decoded.userId);
    const newRefresh = generateRefreshToken(decoded.userId);
    setAuthCookies(res, newAccess, newRefresh);
    res.json({ ok: true });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.auth!.userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({ user: serializeUser(user) });
}

export async function forgotPassword(_req: Request, res: Response): Promise<void> {
  // Stub: integrate email service to send token
  res.json({ message: 'Password reset link sent if email exists' });
}

export async function resetPassword(_req: Request, res: Response): Promise<void> {
  // Stub: verify token and set new password
  res.json({ message: 'Password has been reset' });
}

function setAuthCookies(res: Response, access: string, refresh: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = (process.env.COOKIE_SECURE || 'false') === 'true';
  res.cookie('access_token', access, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd || secure,
    maxAge: 1000 * 60 * 15,
  });
  res.cookie('refresh_token', refresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd || secure,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

function serializeUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    followersCount: user.followers?.length || 0,
    followingCount: user.following?.length || 0,
    createdAt: user.createdAt,
  };
}