import { z } from "zod";
import {
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
} from "../constants/projects";

// Same rules as the backend (backend/src/validators/projectValidator.js)
export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a project name.")
    .min(2, "Project name must be at least 2 characters.")
    .max(PROJECT_NAME_MAX, `Project name can be at most ${PROJECT_NAME_MAX} characters.`),
  description: z
    .string()
    .trim()
    .max(PROJECT_DESCRIPTION_MAX, `Description can be at most ${PROJECT_DESCRIPTION_MAX} characters.`),
  category: z
    .string()
    .refine((value) => PROJECT_CATEGORIES.some((item) => item.value === value), "Choose a category."),
  dueDate: z
    .string()
    .refine((value) => value === "" || !Number.isNaN(Date.parse(value)), "Choose a valid date."),
  status: z.enum(["in_progress", "completed"]),
});