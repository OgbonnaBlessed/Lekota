import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import routes from "@/routes/index";
import { connectMongoDB } from "@/config/database";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://lekota-ebon.vercel.app/", // deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you send cookies, optional
}));

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

// Bootstrap
const startServer = async () => {
  try {
    await connectMongoDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
