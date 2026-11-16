import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/authRoutes.js";
import { projectRoutes } from "./routes/projectRoutes.js";
import { dashboardRoutes } from "./routes/dashboardRoutes.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Builds the Express app. It is separate from server.js so it can be tested without starting a server.
export function createApp() {
  const app = express();

  // Behind a hosting proxy (Render, Railway...) this makes req.ip the visitor's real address
  if (env.isProduction) app.set("trust proxy", 1);

  app.use(helmet());
  // credentials: true lets the browser send and receive the refresh-token cookie
  app.use(cors({ origin: env.clientOrigins, credentials: true }));
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());
  if (!env.isProduction) app.use(morgan("dev"));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  app.use("/api", apiLimiter);

  // To add a new feature, create its routes file and mount it here, in one line.
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}