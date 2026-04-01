import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../dist", "index.html"));
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "5s Arena Blog API is running" });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
