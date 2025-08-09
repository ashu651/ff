import { Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({ username: z.string().min(3), email: z.string().email(), password: z.string().min(6), name: z.string().min(1) });

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid data' });
  const { username, email, password, name } = parsed.data;
  const exists = await User.findOne({ $or: [{ username }, { email }] });
  if (exists) return res.status(409).json({ message: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, passwordHash, name });
  const tokens = issueTokens(user.id);
  setCookies(res, tokens.access, tokens.refresh);
  res.status(201).json({ user: serializeUser(user) });
}

const loginSchema = z.object({ emailOrUsername: z.string(), password: z.string() });
export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid data' });
  const { emailOrUsername, password } = parsed.data;
  const user = await User.findOne({ $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername.toLowerCase() }] });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const tokens = issueTokens(user.id);
  setCookies(res, tokens.access, tokens.refresh);
  res.json({ user: serializeUser(user) });
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refresh_token as string;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;
    const { access, refresh } = issueTokens(decoded.userId);
    setCookies(res, access, refresh);
    res.json({ ok: true });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.status(204).send();
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.auth!.userId).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user });
}

function issueTokens(userId: string) {
  const access = jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
  const refresh = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });
  return { access, refresh };
}

function setCookies(res: Response, access: string, refresh: string) {
  const secure = process.env.NODE_ENV === 'production';
  res.cookie('access_token', access, { httpOnly: true, sameSite: 'lax', secure, maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refresh, { httpOnly: true, sameSite: 'lax', secure, maxAge: 30 * 24 * 60 * 60 * 1000 });
}

function serializeUser(user: any) {
  return { id: user.id, username: user.username, email: user.email, name: user.name, avatar: user.avatar, bio: user.bio };
}