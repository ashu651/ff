import { Server } from 'socket.io';

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId as string | undefined;
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('disconnect', () => {
      // cleanup if needed
    });
  });
}