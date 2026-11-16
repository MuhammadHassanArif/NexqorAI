import { useState } from "react";
import { BadgeCheck, FolderKanban, Gauge, Plus, Sparkles } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { ErrorState } from "../../components/common/ErrorState";
import { Button } from "../../components/ui/Button";
import { OverviewBanner } from "../../components/features/dashboard/OverviewBanner";
import { StatCard } from "../../components/features/dashboard/StatCard";
import { ModuleShortcuts } from "../../components/features/dashboard/ModuleShortcuts";
import { RecentProjects } from "../../components/features/dashboard/RecentProjects";
import { ProjectFormModal } from "../../components/features/projects/ProjectFormModal";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { dashboardService } from "../../services/dashboardService";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Overview() {
  usePageTitle("Overview | NexqorAI");

  const { user } = useAuth();
  const { data, error, isLoading, reload } = useApiData(() => dashboardService.getOverview(), "overview");
  const [createOpen, setCreateOpen] = useState(false);

  // Show placeholders only the first time. Later reloads keep the old numbers on screen.
  const showSkeleton = isLoading && !data;
  const stats = data?.stats;
  const usagePercent = stats?.usage.limit ? Math.round((stats.usage.used / stats.usage.limit) * 100) : 0;
  const firstName = user?.name?.split(" ")[0] ?? "";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${getGreeting()}, ${firstName}.`}
        description="Here's what's happening across your workspace."
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            leftIcon={<Plus className="size-4" aria-hidden="true" />}
            className="w-full sm:w-auto"
          >
            New project
          </Button>
        }
      />

      <OverviewBanner />

      {error && !data ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : (
        <section aria-label="Workspace stats" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FolderKanban}
            label="Active projects"
            value={stats?.activeProjects ?? 0}
            note="Projects in progress"
            iconClass="bg-module-analyst/10 text-module-analyst"
            isLoading={showSkeleton}
          />
          <StatCard
            icon={BadgeCheck}
            label="Completed projects"
            value={stats?.completedProjects ?? 0}
            note="Marked as completed"
            iconClass="bg-success/10 text-success"
            isLoading={showSkeleton}
          />
          <StatCard
            icon={Sparkles}
            label="AI generations"
            value={stats?.generations ?? 0}
            note="This month"
            iconClass="bg-module-docs/10 text-module-docs"
            isLoading={showSkeleton}
          />
          <StatCard
            icon={Gauge}
            label="Monthly usage"
            value={usagePercent}
            suffix="%"
            progress={usagePercent}
            note={stats ? `${stats.usage.used} of ${stats.usage.limit} generations` : ""}
            iconClass="bg-module-analyzer/10 text-module-analyzer"
            isLoading={showSkeleton}
          />
        </section>
      )}

      <ModuleShortcuts />

      {!(error && !data) && (
        <RecentProjects
          projects={data?.recentProjects ?? []}
          isLoading={showSkeleton}
          onCreate={() => setCreateOpen(true)}
        />
      )}

      <ProjectFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          reload();
        }}
      />
    </div>
  );
}