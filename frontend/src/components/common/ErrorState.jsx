import { RotateCw } from "lucide-react";
import { Button } from "../ui/Button";

// Shown when loading data failed (for example the backend is not running).
export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-3xl border border-danger/30 bg-danger/5 px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-ink">We could not load this</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          leftIcon={<RotateCw className="size-4" aria-hidden="true" />}
          className="mt-5"
        >
          Try again
        </Button>
      )}
    </div>
  );
}