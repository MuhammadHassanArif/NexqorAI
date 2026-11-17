import { Generation } from "../models/Generation.js";

// How many AI generations a plan allows each month.
// PLACEHOLDER numbers: they must match frontend/src/constants/plans.js.
export const PLAN_LIMITS = { free: 500, pro: 5000 };

function startOfCurrentMonthUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

// Generations used this month. Failed ones do not count, hidden (deleted from history) ones still do.
// The Overview page and the AI modules both read this, so it is the only place that counts usage.
export async function getUsageSummary(userId) {
  const used = await Generation.countDocuments({
    user: userId,
    status: { $ne: "failed" },
    createdAt: { $gte: startOfCurrentMonthUtc() },
  });

  // Later the limit will depend on the user's plan
  return { used, limit: PLAN_LIMITS.free };
}