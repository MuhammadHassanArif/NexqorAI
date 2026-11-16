import { z } from "zod";
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from "../models/Project.js";

// Same rules as the frontend (src/utils/projectValidators.js)
const name = z
  .string()
  .trim()
  .min(2, "Project name must be at least 2 characters.")
  .max(60, "Project name can be at most 60 characters.");

const description = z.string().trim().max(300, "Description can be at most 300 characters.");

const category = z
  .string()
  .refine((value) => PROJECT_CATEGORIES.includes(value), "Choose a category from the list.");

const status = z
  .string()
  .refine((value) => PROJECT_STATUSES.includes(value), "Choose a valid status.");

// The frontend sends the date as "2026-06-04", or "" when there is no date.
// It becomes a real Date, or null.
const dueDate = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))),
    "Choose a valid date.",
  )
  .nullable()
  .transform((value) => (value ? new Date(`${value}T00:00:00.000Z`) : null));

export const createProjectSchema = z.object({
  name,
  description: description.optional(),
  category: category.optional(),
  dueDate: dueDate.optional(),
});

// For editing, every field is optional, but at least one must be sent
export const updateProjectSchema = z
  .object({
    name: name.optional(),
    description: description.optional(),
    category: category.optional(),
    dueDate: dueDate.optional(),
    status: status.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Send at least one field to update.");