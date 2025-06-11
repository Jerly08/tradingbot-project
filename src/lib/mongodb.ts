import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'trading_bot';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Track connection status
let isConnected = false;

async function connectToDatabase() {
  // If already connected, reuse the connection
  if (isConnected) {
    return mongoose;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    
    isConnected = true;
    console.log('Connected to MongoDB!');
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase; 