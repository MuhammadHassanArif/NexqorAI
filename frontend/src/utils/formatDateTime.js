const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

// "2026-06-04T09:30:00.000Z" -> "4 Jun 2026, 2:30 pm" (in the visitor's own time zone)
export function formatDateTime(isoString) {
  if (!isoString) return "";
  return dateTimeFormatter.format(new Date(isoString));
}