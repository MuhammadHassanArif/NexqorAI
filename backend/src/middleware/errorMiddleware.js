import { ApiError } from "../utils/ApiError.js";

// Runs when no route matched
export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, { code: "NOT_FOUND" }));
}

// Every error in the app ends up here, so the frontend always receives the same JSON shape:
// { message, code, fieldErrors? }
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
      fieldErrors: error.fieldErrors,
    });
  }

  // Two people registered with the same email at the same moment
  if (error?.code === 11000) {
    return res.status(409).json({
      message: "Please check the highlighted field.",
      code: "EMAIL_TAKEN",
      fieldErrors: { email: "An account with this email already exists." },
    });
  }

  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "The request body is not valid JSON.", code: "BAD_JSON" });
  }
  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: "The request is too large.", code: "TOO_LARGE" });
  }

  // Unknown error: log the details on the server, but tell the user nothing technical
  console.error(error);
  return res.status(500).json({
    message: "Something went wrong on our side. Please try again.",
    code: "SERVER_ERROR",
  });
}