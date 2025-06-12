import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'trading_bot';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Print partial URI for debugging (hiding credentials)
const hideCredentials = (uri: string) => {
  try {
    const url = new URL(uri);
    return `${url.protocol}//${url.hostname}:${url.port || '(default)'}${url.pathname}`;
  } catch (e) {
    return 'Invalid URI format';
  }
};

console.log(`MongoDB configuration: URI=${hideCredentials(MONGODB_URI)}, DB=${MONGODB_DB_NAME}`);

// Track connection status
let isConnected = false;

async function connectToDatabase() {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log('Reusing existing MongoDB connection');
    return mongoose;
  }

  try {
    console.log(`Connecting to MongoDB: ${hideCredentials(MONGODB_URI)}`);
    
    // Connect to MongoDB
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
    });
    
    isConnected = true;
    console.log(`Successfully connected to MongoDB! Database: ${MONGODB_DB_NAME}`);
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

export default connectToDatabase; 