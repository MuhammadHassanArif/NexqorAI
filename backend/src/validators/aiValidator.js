import { z } from "zod";
import { GENERATION_MODULES } from "../models/Generation.js";

// Same rules as the frontend (src/utils/aiValidators.js)
export const generateSchema = z.object({
  module: z
    .string()
    .refine((value) => GENERATION_MODULES.includes(value), "Choose an available module."),
  prompt: z
    .string()
    .trim()
    .min(10, "Describe what you need in at least 10 characters.")
    .max(10000, "Your request can be at most 10,000 characters."),
  // Optional. An empty text means "no project".
  projectId: z.string().trim().optional(),
});

export const updateGenerationSchema = z.object({
  favorite: z.boolean({ message: "favorite must be true or false." }),
});