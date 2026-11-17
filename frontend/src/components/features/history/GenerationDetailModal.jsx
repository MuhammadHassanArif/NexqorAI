import { Modal } from "../../ui/Modal";
import { Skeleton } from "../../ui/Skeleton";
import { ErrorState } from "../../common/ErrorState";
import { CopyButton } from "../ai/CopyButton";
import { MarkdownContent } from "../ai/MarkdownContent";
import { useApiData } from "../../../hooks/useApiData";
import { generationService } from "../../../services/generationService";
import { getModule } from "../../../constants/modules";
import { formatDateTime } from "../../../utils/formatDateTime";

// The list leaves out the long answer, so it is loaded here when a result is opened.
// This is a separate component, so it only loads while the window is open.
function DetailBody({ id }) {
  const { data, error, isLoading, reload } = useApiData(() => generationService.get(id), id);

  if (error && !data) return <ErrorState message={error.message} onRetry={reload} />;

  if (isLoading && !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium text-ink-soft">Your request</p>
        <p className="mt-1.5 whitespace-pre-wrap break-words rounded-2xl bg-primary-50 px-4 py-3 text-sm leading-relaxed text-ink">
          {data.prompt}
        </p>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium text-ink-soft">{formatDateTime(data.createdAt)}</p>
          <CopyButton text={data.output} />
        </div>
        <MarkdownContent>{data.output}</MarkdownContent>
      </div>
    </div>
  );
}

export function GenerationDetailModal({ generation, onClose }) {
  const module = generation ? getModule(generation.module) : null;

  return (
    <Modal
      open={Boolean(generation)}
      onClose={onClose}
      title={module?.name ?? "AI result"}
      description={generation?.project ? `Saved to “${generation.project.name}”` : undefined}
      className="max-w-3xl"
    >
      {generation && <DetailBody id={generation.id} />}
    </Modal>
  );
}