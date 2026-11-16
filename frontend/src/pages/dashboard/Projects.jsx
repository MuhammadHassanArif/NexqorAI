import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderKanban, Plus, Search } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { ProjectCard } from "../../components/features/projects/ProjectCard";
import { ProjectFormModal } from "../../components/features/projects/ProjectFormModal";
import { useApiData } from "../../hooks/useApiData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { projectService } from "../../services/projectService";
import { cn } from "../../utils/cn";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "in_progress", label: "In progress" },
  { id: "completed", label: "Completed" },
];

export function Projects() {
  usePageTitle("My Projects | NexqorAI");

  const [searchParams, setSearchParams] = useSearchParams();
  const search = (searchParams.get("q") ?? "").trim();

  const { data, error, isLoading, reload } = useApiData(() => projectService.list(), "projects");
  const projects = useMemo(() => data ?? [], [data]);

  const [filter, setFilter] = useState("all");
  // null = window closed, "new" = creating, or the project that is being edited
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: "" });
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  const counts = useMemo(
    () => ({
      all: projects.length,
      in_progress: projects.filter((project) => project.status === "in_progress").length,
      completed: projects.filter((project) => project.status === "completed").length,
    }),
    [projects],
  );

  const visibleProjects = useMemo(() => {
    const term = search.toLowerCase();
    return projects.filter(
      (project) =>
        (filter === "all" || project.status === filter) &&
        (!term ||
          project.name.toLowerCase().includes(term) ||
          project.category.toLowerCase().includes(term)),
    );
  }, [projects, filter, search]);

  const toggleStatus = async (project) => {
    setActionError("");
    setBusyId(project.id);
    try {
      await projectService.update(project.id, {
        status: project.status === "completed" ? "in_progress" : "completed",
      });
      reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setBusyId(null);
    }
  };

  const closeDelete = () => {
    setDeleting(null);
    setDeleteState({ loading: false, error: "" });
  };

  const confirmDelete = async () => {
    setDeleteState({ loading: true, error: "" });
    try {
      await projectService.remove(deleting.id);
      closeDelete();
      reload();
    } catch (requestError) {
      setDeleteState({ loading: false, error: requestError.message });
    }
  };

  const showSkeleton = isLoading && !data;
  const editingProject = editing && editing !== "new" ? editing : undefined;

  let content;
  if (error && !data) {
    content = <ErrorState message={error.message} onRetry={reload} />;
  } else if (showSkeleton) {
    content = (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  } else if (projects.length === 0) {
    content = (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to keep your ideas, tasks and AI results together."
        action={
          <Button onClick={() => setEditing("new")} leftIcon={<Plus className="size-4" aria-hidden="true" />}>
            Create your first project
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        <div
          role="group"
          aria-label="Filter projects"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {FILTERS.map((item) => {
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500",
                  isActive
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-line bg-white text-ink-soft hover:border-primary-300 hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs tabular-nums",
                    isActive ? "bg-white/20" : "bg-primary-50 text-primary-700",
                  )}
                >
                  {counts[item.id]}
                </span>
              </button>
            );
          })}
        </div>

        {search && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            Results for <span className="font-semibold text-ink">“{search}”</span>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="font-semibold text-primary-600 hover:underline"
            >
              Clear search
            </button>
          </p>
        )}

        {visibleProjects.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No projects match"
            description="Try another filter or a different search word."
          />
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectCard
                  project={project}
                  busy={busyId === project.id}
                  onEdit={setEditing}
                  onToggleStatus={toggleStatus}
                  onDelete={setDeleting}
                />
              </motion.li>
            ))}

            {filter === "all" && !search && (
              <li>
                <button
                  type="button"
                  onClick={() => setEditing("new")}
                  className="flex h-full min-h-56 w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary-200 bg-white/60 text-ink-soft outline-offset-2 transition-colors hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-primary-500"
                >
                  <Plus className="size-6" aria-hidden="true" />
                  <span className="text-sm font-semibold">Create new project</span>
                </button>
              </li>
            )}
          </ul>
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your projects"
        description="Organize every idea, client and launch in one place."
        actions={
          <Button
            onClick={() => setEditing("new")}
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
            className="w-full sm:w-auto"
          >
            New project
          </Button>
        }
      />

      <Alert message={actionError} />

      {content}

      <ProjectFormModal
        open={editing !== null}
        project={editingProject}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          reload();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={deleting ? `Delete “${deleting.name}”?` : ""}
        description="This removes the project for good. You cannot undo it."
        confirmLabel="Delete project"
        loading={deleteState.loading}
        error={deleteState.error}
      />
    </div>
  );
}