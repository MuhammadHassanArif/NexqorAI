import { z } from "zod";

export const NAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORDS_MISMATCH_MESSAGE = "Passwords do not match.";

// name@domain.tld
// - the name part starts and ends with a letter or number (dots, _, %, + and - are allowed inside)
// - the domain needs at least one dot and a last part of 2+ letters, so "a@b" or "a@gmail" is rejected
const EMAIL_REGEX =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

// Letters from any language first, then letters, spaces, dots, hyphens and apostrophes
const NAME_REGEX = /^\p{L}[\p{L}\s.'-]*$/u;

// ---------- Password rules (used by the schema and by the live checklist) ----------

export const PASSWORD_RULES = [
  {
    id: "length",
    label: `${PASSWORD_MIN_LENGTH}+ characters`,
    test: (value) => value.length >= PASSWORD_MIN_LENGTH,
  },
  { id: "upper", label: "Capital letter (A-Z)", test: (value) => /[A-Z]/.test(value) },
  { id: "lower", label: "Small letter (a-z)", test: (value) => /[a-z]/.test(value) },
  { id: "number", label: "Number (0-9)", test: (value) => /\d/.test(value) },
  {
    id: "special",
    label: "Special character (!@#$)",
    test: (value) => /[^A-Za-z0-9\s]/.test(value),
  },
];

// Returns which rules pass, and an overall level for the strength bar.
export function evaluatePassword(password) {
  const rules = PASSWORD_RULES.map((rule) => ({
    id: rule.id,
    label: rule.label,
    passed: rule.test(password),
  }));
  const passedCount = rules.filter((rule) => rule.passed).length;

  let level = "empty";
  if (password.length > 0) {
    if (passedCount <= 2) level = "weak";
    else if (passedCount === 3) level = "fair";
    else if (passedCount === 4) level = "good";
    else level = "strong";
  }

  const filledSegments = password.length === 0 ? 0 : Math.max(1, passedCount - 1);
  return { rules, passedCount, level, filledSegments };
}

// ---------- Email typo helper ----------

const DOMAIN_FIXES = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
};

// If the domain looks like a common typo (gamil.com), returns the corrected email, otherwise null.
export function suggestEmailDomain(email) {
  const value = email.trim().toLowerCase();
  const atIndex = value.lastIndexOf("@");
  if (atIndex < 1) return null;

  const fixedDomain = DOMAIN_FIXES[value.slice(atIndex + 1)];
  return fixedDomain ? `${value.slice(0, atIndex)}@${fixedDomain}` : null;
}

// ---------- Schemas ----------

const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(254, "This email address is too long.")
  .regex(EMAIL_REGEX, "Enter a valid email address, like name@gmail.com.")
  .refine((value) => !value.includes(".."), "An email cannot have two dots in a row.");

const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Enter your full name.")
  .min(2, "Your name must be at least 2 characters.")
  .max(NAME_MAX_LENGTH, `Your name can be at most ${NAME_MAX_LENGTH} characters.`)
  .regex(NAME_REGEX, "Use letters only. Spaces, dots, hyphens and apostrophes are allowed.");

const newPasswordSchema = z
  .string()
  .min(1, "Create a password.")
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Password can be at most ${PASSWORD_MAX_LENGTH} characters.`)
  .regex(/[A-Z]/, "Add at least one capital letter (A-Z).")
  .regex(/[a-z]/, "Add at least one small letter (a-z).")
  .regex(/\d/, "Add at least one number (0-9).")
  .regex(/[^A-Za-z0-9\s]/, "Add at least one special character, like ! @ # or $.")
  .refine((value) => !/\s/.test(value), "Password cannot contain spaces.");

export const signupSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: newPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: PASSWORDS_MISMATCH_MESSAGE,
    path: ["confirmPassword"],
  });

// Login only checks the email format and that a password was typed.
// The password strength rules are NOT applied here: the server decides if the password is right.
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
  rememberMe: z.boolean().optional(),
});