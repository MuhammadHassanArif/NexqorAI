import { Link } from "react-router-dom";
import { Calendar, Folder } from "lucide-react";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";
import { ProjectProgress } from "../projects/ProjectProgress";
import { getCategoryTheme } from "../../../constants/projects";
import { ROUTES } from "../../../constants/routes";
import { formatDate } from "../../../utils/formatDate";
import { cn } from "../../../utils/cn";

// The latest projects on the Overview page.
export function RecentProjects({ projects, isLoading, onCreate }) {
  return (
    <section aria-labelledby="recent-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="recent-heading" className="text-lg font-semibold text-ink sm:text-xl">
            Recent projects
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Pick up where you left off.</p>
        </div>
        <Link to={ROUTES.projects} className="text-sm font-semibold text-primary-600 hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-white">
        {isLoading ? (
          <div className="space-y-4 p-5">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : projects.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-ink-soft">You have no projects yet.</p>
            <Button onClick={onCreate} className="mt-4">
              Create your first project
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {projects.map((project) => {
              const theme = getCategoryTheme(project.category);
              return (
                <li
                  key={project.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        theme.soft,
                        theme.text,
                      )}
                    >
                      <Folder className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{project.name}</p>
                      <p className="truncate text-xs text-ink-soft">{project.category}</p>
                    </div>
                  </div>

                  <div className="sm:w-48">
                    <ProjectProgress value={project.progress} barClass={theme.bar} />
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-ink-soft sm:w-32 sm:justify-end">
                    <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
                    {project.dueDate ? formatDate(project.dueDate) : "No due date"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}