import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nx_yatra';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${(error as Error).message}`);
    console.warn(`[MongoDB] Running in fallback mode. Ensure MongoDB is running on ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nx_yatra'}`);
    throw error; 
  }
};
