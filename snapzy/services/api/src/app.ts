import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import swaggerUi from 'swagger-ui-express';
import { router as authRouter } from './routes/auth.router.js';
import { router as postsRouter } from './routes/posts.router.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use(limiter);

const swaggerDoc = { openapi: '3.0.0', info: { title: 'Snapzy API', version: '0.1.0' } } as any;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postsRouter);

app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
app.use((err: any, _req: any, res: any, _next: any) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

export default app;