import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/overview", requireAuth, dashboardController.overview);