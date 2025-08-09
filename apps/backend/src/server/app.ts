import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { router as authRouter } from '../server/routes/auth.routes.js';
import { router as usersRouter } from '../server/routes/users.routes.js';
import { router as postsRouter } from '../server/routes/posts.routes.js';
import { router as commentsRouter } from '../server/routes/comments.routes.js';
import { router as storiesRouter } from '../server/routes/stories.routes.js';
import { router as messagesRouter } from '../server/routes/messages.routes.js';
import { router as notificationsRouter } from '../server/routes/notifications.routes.js';
import { router as searchRouter } from '../server/routes/search.routes.js';
import { router as uploadsRouter } from '../server/routes/uploads.routes.js';
import { router as exploreRouter } from '../server/routes/explore.routes.js';
import { router as moderationRouter } from '../server/routes/moderation.routes.js';
import { router as commerceRouter } from '../server/routes/commerce.routes.js';
import { router as analyticsRouter } from '../server/routes/analytics.routes.js';
import { router as adminRouter } from '../server/routes/admin.routes.js';
import { notFoundHandler, errorHandler } from '../server/middlewares/error.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN || '*').split(','), credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/search', searchRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/explore', exploreRouter);
app.use('/api/moderation', moderationRouter);
app.use('/api/commerce', commerceRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;