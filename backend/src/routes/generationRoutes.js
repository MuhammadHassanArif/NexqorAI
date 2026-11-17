import { Router } from "express";
import * as generationController from "../controllers/generationController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateGenerationSchema } from "../validators/aiValidator.js";

export const generationRoutes = Router();

generationRoutes.use(requireAuth);

generationRoutes.get("/", generationController.list);
generationRoutes.get("/:id", generationController.getOne);
generationRoutes.patch("/:id", validate(updateGenerationSchema), generationController.update);
generationRoutes.delete("/:id", generationController.remove);