import { z } from "zod";

// These rules are the same as the ones in the frontend (src/utils/validators.js).
// The frontend checks are for the user's comfort. These checks are the ones that really protect us,
// because anybody can skip the frontend and call the API directly.

const EMAIL_REGEX =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
const NAME_REGEX = /^\p{L}[\p{L}\s.'-]*$/u;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .max(254, "This email address is too long.")
  .regex(EMAIL_REGEX, "Enter a valid email address, like name@gmail.com.")
  .refine((value) => !value.includes(".."), "An email cannot have two dots in a row.");

const fullName = z
  .string()
  .trim()
  .min(2, "Your name must be at least 2 characters.")
  .max(30, "Your name can be at most 30 characters.")
  .regex(NAME_REGEX, "Use letters only. Spaces, dots, hyphens and apostrophes are allowed.");

const newPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password can be at most 64 characters.")
  .regex(/[A-Z]/, "Add at least one capital letter (A-Z).")
  .regex(/[a-z]/, "Add at least one small letter (a-z).")
  .regex(/\d/, "Add at least one number (0-9).")
  .regex(/[^A-Za-z0-9\s]/, "Add at least one special character, like ! @ # or $.")
  .refine((value) => !/\s/.test(value), "Password cannot contain spaces.");

// Fields that are not listed here (like "plan" or "confirmPassword") are removed automatically.
export const registerSchema = z.object({
  fullName,
  email,
  password: newPassword,
});

// Login does not check the password strength, it only checks that a password was sent.
export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password.").max(128, "Password is too long."),
  rememberMe: z.boolean().optional().default(false),
});