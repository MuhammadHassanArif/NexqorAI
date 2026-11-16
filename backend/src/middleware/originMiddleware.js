import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// Browsers always send an "Origin" header on POST requests. If it comes from a website
// that is not ours, the request is refused. This stops other websites from using
// the visitor's cookie to call our API (CSRF).
// Requests without an Origin header (Postman, server tools) are allowed.
export function requireTrustedOrigin(req, res, next) {
  const origin = req.get("origin");

  if (origin && !env.clientOrigins.includes(origin)) {
    return next(new ApiError(403, "This request is not allowed.", { code: "BAD_ORIGIN" }));
  }
  return next();
}