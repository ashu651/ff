import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

async function start() {
  const port = Number(process.env.PORT || 4000);
  const mongoUri = process.env.MONGO_URI as string;
  if (!mongoUri) throw new Error('MONGO_URI missing');
  await mongoose.connect(mongoUri, { dbName: 'snapzy' });

  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
  });

  if (process.env.REDIS_URL) {
    const { createAdapter } = await import('@socket.io/redis-adapter');
    const Redis = (await import('ioredis')).default as any;
    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = new Redis(process.env.REDIS_URL);
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.on('connection', (socket) => {
    socket.on('typing', (room: string) => socket.to(room).emit('typing'));
  });

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API running at http://localhost:${port}`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});