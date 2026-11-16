import { cn } from "../../utils/cn";

const SIZES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
};

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Round avatar with initials, like the "AS" avatar in the Figma design.
export function UserAvatar({ name, size = "md", className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-400 to-accent font-semibold text-white",
        SIZES[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}