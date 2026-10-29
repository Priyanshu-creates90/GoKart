import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  // If already connected, reuse connection (essential for serverless execution)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // Never use process.exit(1) on Vercel serverless
  }
};

export default connectDB;
