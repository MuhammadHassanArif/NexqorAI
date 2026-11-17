import { useState } from "react";
import { History, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { ErrorState } from "../../components/common/ErrorState";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Skeleton } from "../../components/ui/Skeleton";
import { GenerationRow } from "../../components/features/history/GenerationRow";
import { GenerationDetailModal } from "../../components/features/history/GenerationDetailModal";
import { useApiData } from "../../hooks/useApiData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { generationService } from "../../services/generationService";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";

const TABS = [
  { id: "all", label: "All generations" },
  { id: "favorites", label: "Favorites" },
];

// The list for one tab. The page gives each tab its own copy (see "key" below),
// so switching tabs always starts with a clean loading state.
function HistoryList({ favoritesOnly }) {
  const { data, error, isLoading, reload } = useApiData(
    () => generationService.list({ favorite: favoritesOnly }),
    "history",
  );
  const generations = data ?? [];

  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteState, setDeleteState] = useState({ loading: false, error: "" });
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  const toggleFavorite = async (generation) => {
    setActionError("");
    setBusyId(generation.id);
    try {
      await generationService.update(generation.id, { favorite: !generation.favorite });
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
      await generationService.remove(deleting.id);
      closeDelete();
      reload();
    } catch (requestError) {
      setDeleteState({ loading: false, error: requestError.message });
    }
  };

  if (error && !data) return <ErrorState message={error.message} onRetry={reload} />;

  if (isLoading && !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-16 rounded-2xl" />
      </div>
    );
  }

  return (
    <>
      <Alert message={actionError} />

      {generations.length === 0 ? (
        <EmptyState
          icon={favoritesOnly ? Sparkles : History}
          title={favoritesOnly ? "No favorites yet" : "No results yet"}
          description={
            favoritesOnly
              ? "Press the star on a result to keep it here."
              : "Everything you generate with the AI modules is saved here."
          }
          action={
            !favoritesOnly && (
              <Button as={Link} to={ROUTES.modules}>
                Open AI Modules
              </Button>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
          {generations.map((generation) => (
            <GenerationRow
              key={generation.id}
              generation={generation}
              busy={busyId === generation.id}
              onView={setViewing}
              onToggleFavorite={toggleFavorite}
              onDelete={setDeleting}
            />
          ))}
        </ul>
      )}

      <GenerationDetailModal generation={viewing} onClose={() => setViewing(null)} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title="Delete this result?"
        description="It will be removed from your history. It still counts in this month's usage."
        confirmLabel="Delete result"
        loading={deleteState.loading}
        error={deleteState.error}
      />
    </>
  );
}

export function GenerationHistory() {
  usePageTitle("Generation History | NexqorAI");
  const [tab, setTab] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generation history"
        description="Review, reuse and continue your latest AI results."
      />

      <div role="group" aria-label="Filter results" className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => {
          const isActive = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500",
                isActive
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-line bg-white text-ink-soft hover:border-primary-300 hover:text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <HistoryList key={tab} favoritesOnly={tab === "favorites"} />
    </div>
  );
}