import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './server/app';
import { connectToDatabase } from './server/database/mongoose';
import { registerSocketHandlers } from './server/sockets';
import dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT || 4000);

async function bootstrap(): Promise<void> {
  await connectToDatabase();

  const httpServer = http.createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || '*',
      credentials: true,
    },
  });

  registerSocketHandlers(io);

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API ready on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});