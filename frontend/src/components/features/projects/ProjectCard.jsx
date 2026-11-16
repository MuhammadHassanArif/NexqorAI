import { Calendar, Check, Folder, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { ProjectProgress } from "./ProjectProgress";
import { PROJECT_STATUS_LABELS, getCategoryTheme } from "../../../constants/projects";
import { formatDate } from "../../../utils/formatDate";
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

// One project, like the cards in the Figma "Your projects" page.
export function ProjectCard({ project, busy, onEdit, onToggleStatus, onDelete }) {
  const theme = getCategoryTheme(project.category);
  const isCompleted = project.status === "completed";

  return (
    <article
      aria-busy={busy || undefined}
      className={cn(
        "flex h-full flex-col rounded-3xl border border-line bg-white p-5 transition-[box-shadow,opacity] duration-300 hover:shadow-glass",
        busy && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-11 place-items-center rounded-2xl", theme.soft, theme.text)}>
          <Folder className="size-5" aria-hidden="true" />
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium",
            isCompleted ? "bg-success/10 text-success" : "bg-primary-50 text-primary-700",
          )}
        >
          {PROJECT_STATUS_LABELS[project.status]}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-ink-soft">{project.category}</p>
      <h3 className="mt-1 break-words text-lg font-semibold text-ink">{project.name}</h3>
      {project.description && (
        <p className="mt-2 line-clamp-2 break-words text-sm text-ink-soft">{project.description}</p>
      )}

      <div className="mt-5">
        <ProjectProgress value={project.progress} barClass={theme.bar} />
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="flex min-w-0 items-center gap-1.5 text-xs text-ink-soft">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {project.dueDate ? `Due ${formatDate(project.dueDate)}` : "No due date"}
            </span>
          </p>

          <div className="flex shrink-0 items-center gap-0.5">
            <IconButton
              label={isCompleted ? "Reopen project" : "Mark as completed"}
              onClick={() => onToggleStatus(project)}
              disabled={busy}
            >
              {isCompleted ? (
                <RotateCcw className="size-4" aria-hidden="true" />
              ) : (
                <Check className="size-4" aria-hidden="true" />
              )}
            </IconButton>
            <IconButton label="Edit project" onClick={() => onEdit(project)} disabled={busy}>
              <Pencil className="size-4" aria-hidden="true" />
            </IconButton>
            <IconButton label="Delete project" onClick={() => onDelete(project)} disabled={busy} danger>
              <Trash2 className="size-4" aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>
    </article>
  );
}