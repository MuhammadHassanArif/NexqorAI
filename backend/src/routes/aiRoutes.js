import { Router } from "express";
import * as aiController from "../controllers/aiController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { aiLimiter } from "../middleware/rateLimitMiddleware.js";
import { validate } from "../middleware/validate.js";
import { generateSchema } from "../validators/aiValidator.js";

export const aiRoutes = Router();

aiRoutes.use(requireAuth);

aiRoutes.post("/generate", aiLimiter, validate(generateSchema), aiController.generate);