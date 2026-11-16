import rateLimit from "express-rate-limit";

function createLimiter({ windowMs, limit, message, skipSuccessfulRequests = false }) {
  return rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({ message, code: "RATE_LIMITED" });
    },
  });
}

// 10 wrong attempts in 15 minutes from the same address, then login is paused.
// Successful logins are not counted.
export const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: "Too many login attempts. Please try again in 15 minutes.",
});

export const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: "Too many accounts were created from this network. Please try again later.",
});


// A general limit for every API route, so one visitor cannot flood the server.
export const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  message: "Too many requests. Please slow down and try again in a few minutes.",
});