import { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { DeviceSession } from '../models/DeviceSession.js';

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

const loginSchema = z.object({ identifier: z.string(), password: z.string(), totp: z.string().optional() });

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid data' });
    return;
  }
  const { identifier, password, totp } = parsed.data;
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
  if (user.twoFactorEnabled) {
    const speakeasy = (await import('speakeasy')).default;
    const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret || '', encoding: 'base32', token: totp || '' });
    if (!verified) {
      res.status(401).json({ message: 'Two-factor code required' });
      return;
    }
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  setAuthCookies(res, accessToken, refreshToken);
  // track session
  await DeviceSession.create({ user: user._id, userAgent: req.headers['user-agent'], ip: req.ip });
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

export async function twofaSetup(req: Request, res: Response): Promise<void> {
  const speakeasy = (await import('speakeasy')).default;
  const qrcode = await import('qrcode');
  const secret = speakeasy.generateSecret({ name: `Snapzy (${req.auth!.userId})` });
  const otpauth = secret.otpauth_url as string;
  const dataUrl = await qrcode.toDataURL(otpauth);
  await User.findByIdAndUpdate(req.auth!.userId, { twoFactorSecret: secret.base32 });
  res.json({ otpauthUrl: otpauth, qr: dataUrl });
}

export async function twofaEnable(req: Request, res: Response): Promise<void> {
  const code = String(req.body.code || '');
  const user = await User.findById(req.auth!.userId);
  if (!user?.twoFactorSecret) return void res.status(400).json({ message: 'No 2FA secret' });
  const speakeasy = (await import('speakeasy')).default;
  const ok = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: code });
  if (!ok) return void res.status(400).json({ message: 'Invalid code' });
  user.twoFactorEnabled = true;
  await user.save();
  res.json({ ok: true });
}

export async function twofaDisable(req: Request, res: Response): Promise<void> {
  await User.findByIdAndUpdate(req.auth!.userId, { twoFactorEnabled: false, twoFactorSecret: null });
  res.json({ ok: true });
}

export async function sessions(req: Request, res: Response): Promise<void> {
  const list = await DeviceSession.find({ user: req.auth!.userId }).sort({ createdAt: -1 }).lean();
  res.json({ sessions: list });
}

export async function revokeSession(req: Request, res: Response): Promise<void> {
  await DeviceSession.deleteOne({ _id: req.params.id, user: req.auth!.userId });
  res.json({ ok: true });
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