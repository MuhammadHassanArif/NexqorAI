import { Router } from "express";
import * as projectController from "../controllers/projectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validators/projectValidator.js";

export const projectRoutes = Router();

// Every project route needs a logged-in user
projectRoutes.use(requireAuth);

projectRoutes.get("/", projectController.list);
projectRoutes.post("/", validate(createProjectSchema), projectController.create);
projectRoutes.get("/:id", projectController.getOne);
projectRoutes.patch("/:id", validate(updateProjectSchema), projectController.update);
projectRoutes.delete("/:id", projectController.remove);