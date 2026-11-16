// Dates without a time (like a due date) are stored as UTC midnight,
// so they are shown in UTC too. Otherwise the day could shift in some time zones.
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(isoString) {
  if (!isoString) return "";
  return dateFormatter.format(new Date(isoString));
}

// "2026-06-04T00:00:00.000Z" -> "2026-06-04" (the format of <input type="date">)
export function toDateInputValue(isoString) {
  return isoString ? isoString.slice(0, 10) : "";
}