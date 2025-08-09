import dotenv from 'dotenv';
import { connectToDatabase } from '../server/database/mongoose.js';
import { Post } from '../server/models/Post.js';

dotenv.config();

async function tick() {
  const now = new Date();
  const result = await Post.updateMany({ isPublished: false, scheduledAt: { $lte: now } }, { $set: { isPublished: true } });
  // eslint-disable-next-line no-console
  console.log(`[scheduler] published ${result.modifiedCount} posts at ${now.toISOString()}`);
}

async function main() {
  await connectToDatabase();
  // run forever
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await tick();
    await new Promise((r) => setTimeout(r, 15000));
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});