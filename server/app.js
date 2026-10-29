import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

import connectDB from "./config/connectDB.js";

import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRouter from "./route/address.route.js";
import orderRouter from "./route/order.route.js";
import chatRouter from "./route/chat.route.js";

const app = express();

app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // In development or serverless, permit frontend requests
      if (!origin || !process.env.FRONTEND_URL || origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Respond to favicon immediately so Chrome doesn't trigger database connections
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Health-check routes (respond immediately without waiting on DB)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GoKart server is running",
    environment: process.env.NODE_ENV || "production",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GoKart API is running",
  });
});

// Ensure database connection before API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed. Please ensure MONGODB_URL is configured in Vercel Environment Variables and MongoDB Atlas has 0.0.0.0/0 whitelisted in Network Access.",
      error: error.message,
    });
  }
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;

