// How many AI generations a plan allows each month.
// PLACEHOLDER numbers: they must match frontend/src/constants/plans.js.
export const PLAN_LIMITS = { free: 500, pro: 5000 };

// TEMPORARY: AI generations are not saved yet, so nothing has been used.
// When the AI modules exist, count this month's generations of the user here.
// The Overview page already shows whatever this function returns, so nothing else has to change.
export async function getUsageSummary(_userId) {
  return { used: 0, limit: PLAN_LIMITS.free };
}