import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const uri = process.env.MONGO_URI as string;
  if (!uri) throw new Error('MONGO_URI missing');

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, { dbName: 'snapzy' });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}