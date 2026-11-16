import { cn } from "../../utils/cn";

// Standard page section: consistent spacing and width for every part of the Home page.
export function Section({ id, className, innerClassName, children }) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 sm:py-28", className)}>
      <div className={cn("mx-auto max-w-6xl", innerClassName)}>{children}</div>
    </section>
  );
}