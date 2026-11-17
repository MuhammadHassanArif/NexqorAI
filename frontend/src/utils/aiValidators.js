import { z } from "zod";

export const PROMPT_MAX_LENGTH = 10000;

// Same rules as the backend (backend/src/validators/aiValidator.js)
export const generateSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Describe what you need.")
    .min(10, "Describe what you need in at least 10 characters.")
    .max(PROMPT_MAX_LENGTH, `Your request can be at most ${PROMPT_MAX_LENGTH.toLocaleString()} characters.`),
  // "" means: do not save to a project
  projectId: z.string(),
});