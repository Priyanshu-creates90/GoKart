import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let cachedPromise = null;

const connectDB = async () => {
  // If already connected, reuse connection (essential for serverless execution)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  cachedPromise = mongoose
    .connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      cachedPromise = null; // Reset cached promise so subsequent requests can retry
      console.error("MongoDB connection error:", err.message);
      throw err;
    });

  return cachedPromise;
};

export default connectDB;
