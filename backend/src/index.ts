import dotenv from "dotenv";
dotenv.config();

import { connectMongoDB } from "@/config/database";
import routes from "@/routes/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://lekota-virid.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// Base route
app.get("/", (_req, res) => {
  res.json({
    name: "Lekota API",
    status: "running",
    version: "1.0.0",
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

// Error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  },
);

// 404
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const startServer = async () => {
  try {
    await connectMongoDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

startServer();
