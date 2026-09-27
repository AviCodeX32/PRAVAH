import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pravah_db';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[PRAVAH DB] Connected successfully to MongoDB at ${MONGODB_URI}`);
  } catch (error) {
    console.error(`[PRAVAH DB] Connection error:`, error.message);
    process.exit(1);
  }
}
