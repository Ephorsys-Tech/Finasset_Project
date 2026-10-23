import dns from 'dns';
import mongoose from 'mongoose';
import { config } from './env';

// Ensure DNS SRV records for MongoDB Atlas resolve properly across Windows and ISP resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setting DNS servers is not permitted
}

/**
 * Global cached MongoDB Atlas connection pooling
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  const uri = config.MONGODB_URI;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log('✅ Connected successfully to MongoDB Atlas / Database');
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn('⚠️ MongoDB connection warning (will retry on next request):', err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
