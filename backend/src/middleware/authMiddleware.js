import { verifyAccessToken } from "../services/tokenService.js";
import { ApiError } from "../utils/ApiError.js";

// Protects a route. The frontend sends:  Authorization: Bearer <access token>
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Please log in to continue.", { code: "NO_TOKEN" }));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    const expired = error.name === "TokenExpiredError";
    return next(
      new ApiError(
        401,
        expired ? "Your session has expired." : "Invalid session. Please log in again.",
        { code: expired ? "TOKEN_EXPIRED" : "INVALID_TOKEN" },
      ),
    );
  }
}

// Use after requireAuth, for example requireRole("admin") for admin-only routes.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (roles.includes(req.user?.role)) return next();
    return next(
      new ApiError(403, "You do not have permission to do this.", { code: "FORBIDDEN" }),
    );
  };
}