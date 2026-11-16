import { cn } from "../../utils/cn";

// Grey pulsing block shown while data is loading.
export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-primary-100/60", className)} aria-hidden="true" />;
}