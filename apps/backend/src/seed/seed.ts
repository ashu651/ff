import dotenv from 'dotenv';
import { connectToDatabase } from '../server/database/mongoose.js';
import { User } from '../server/models/User.js';
import { Post } from '../server/models/Post.js';

dotenv.config();

async function run() {
  await connectToDatabase();
  await User.deleteMany({});
  await Post.deleteMany({});

  const alice = await User.create({ username: 'alice', email: 'alice@example.com', name: 'Alice', passwordHash: '$2a$10$lF4m2zR.G0cR1o0O8l0oE.QDg0AplEoBNc6l3kYwlKC5Y0MBQmOOa' });
  const bob = await User.create({ username: 'bob', email: 'bob@example.com', name: 'Bob', passwordHash: '$2a$10$lF4m2zR.G0cR1o0O8l0oE.QDg0AplEoBNc6l3kYwlKC5Y0MBQmOOa' });
  await User.findByIdAndUpdate(alice._id, { $addToSet: { following: bob._id } });
  await User.findByIdAndUpdate(bob._id, { $addToSet: { followers: alice._id } });

  await Post.create([
    { user: alice._id, caption: 'Hello from Alice', mediaUrl: 'https://placehold.co/600x600', mediaType: 'image', tags: ['hello'] },
    { user: bob._id, caption: 'Bob here', mediaUrl: 'https://placehold.co/600x600', mediaType: 'image', tags: ['bob'] },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed complete. Users: alice/bob, password: password');
}

run().then(() => process.exit(0));