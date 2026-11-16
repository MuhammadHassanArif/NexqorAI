import { ArrowRight } from "lucide-react";
import { cn } from "../../../utils/cn";

// One AI module card. Clicking it shows that module's example below the grid.
export function ServiceCard({ module, selected, onSelect }) {
  const Icon = module.icon;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border bg-white p-6 text-left outline-offset-2 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-primary-500",
        selected
          ? cn("border-transparent shadow-glass ring-2", module.theme.ring)
          : "border-line hover:-translate-y-1 hover:shadow-glass",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1", module.theme.bar)} aria-hidden="true" />

      <span
        className={cn(
          "grid size-12 place-items-center rounded-2xl",
          module.theme.soft,
          module.theme.text,
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <h3 className="mt-5 text-lg font-semibold text-ink">{module.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{module.description}</p>

      <span
        className={cn("mt-5 inline-flex items-center gap-1.5 text-sm font-semibold", module.theme.text)}
      >
        {selected ? "Showing example" : "See example"}
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </button>
  );
}