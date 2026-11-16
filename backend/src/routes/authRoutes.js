import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { requireTrustedOrigin } from "../middleware/originMiddleware.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimitMiddleware.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  requireTrustedOrigin,
  registerLimiter,
  validate(registerSchema),
  authController.register,
);
authRoutes.post(
  "/login",
  requireTrustedOrigin,
  loginLimiter,
  validate(loginSchema),
  authController.login,
);
authRoutes.post("/refresh", requireTrustedOrigin, authController.refresh);
authRoutes.post("/logout", requireTrustedOrigin, authController.logout);
authRoutes.get("/me", requireAuth, authController.me);