import { Eye, Star, Trash2 } from "lucide-react";
import { getModule } from "../../../constants/modules";
import { formatDateTime } from "../../../utils/formatDateTime";
import { cn } from "../../../utils/cn";

function IconButton({ label, onClick, disabled, danger = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 place-items-center rounded-lg text-ink-soft outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 disabled:pointer-events-none",
        danger ? "hover:bg-danger/10 hover:text-danger" : "hover:bg-primary-50 hover:text-primary-700",
      )}
    >
      {children}
    </button>
  );
}

// One saved result in the Generation History list.
export function GenerationRow({ generation, busy, onView, onToggleFavorite, onDelete }) {
  const module = getModule(generation.module);
  const Icon = module?.icon;

  return (
    <li
      aria-busy={busy || undefined}
      className={cn(
        "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5",
        busy && "opacity-60",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {Icon && (
          <span
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              module.theme.soft,
              module.theme.text,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{generation.prompt}</p>
          <p className="mt-0.5 truncate text-xs text-ink-soft">
            {module?.name ?? generation.module}
            {generation.project ? ` · ${generation.project.name}` : ""} · {formatDateTime(generation.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-0.5 self-end sm:self-auto">
        <IconButton
          label={generation.favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={() => onToggleFavorite(generation)}
          disabled={busy}
        >
          <Star
            className={cn("size-4", generation.favorite && "fill-warning text-warning")}
            aria-hidden="true"
          />
        </IconButton>
        <IconButton label="View result" onClick={() => onView(generation)} disabled={busy}>
          <Eye className="size-4" aria-hidden="true" />
        </IconButton>
        <IconButton label="Delete result" onClick={() => onDelete(generation)} disabled={busy} danger>
          <Trash2 className="size-4" aria-hidden="true" />
        </IconButton>
      </div>
    </li>
  );
}