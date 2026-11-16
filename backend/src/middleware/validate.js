import { ApiError } from "../utils/ApiError.js";

// Checks req.body against a zod schema before the controller runs.
// On success, req.body is replaced by the cleaned data (trimmed, lower-cased, unknown fields removed).
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (field !== undefined && !(field in fieldErrors)) {
          fieldErrors[String(field)] = issue.message;
        }
      }
      return next(
        new ApiError(400, "Please fix the highlighted fields.", {
          fieldErrors,
          code: "VALIDATION_ERROR",
        }),
      );
    }

    req.body = result.data;
    return next();
  };
}