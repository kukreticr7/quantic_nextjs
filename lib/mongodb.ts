import mongoose from 'mongoose';

// Get MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI as string;

// Validate MongoDB URI environment variable
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Track connection status
let isConnected = false;

/**
 * Connect to MongoDB database
 * Implements connection pooling and error handling
 * Promise that resolves when connection is established
 */
async function dbConnect() {
  // Return if already connected
  if (isConnected) {
    return;
  }

  try {
    // Attempt to connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default dbConnect; 