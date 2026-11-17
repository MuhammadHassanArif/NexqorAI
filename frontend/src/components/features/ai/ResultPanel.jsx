import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleAlert, RotateCw } from "lucide-react";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";
import { CopyButton } from "./CopyButton";
import { MarkdownContent } from "./MarkdownContent";
import { ROUTES } from "../../../constants/routes";
import { DURATION, EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// The right side of the module page. It has four looks: empty, working, error and result.
export function ResultPanel({ moduleConfig, request, onRetry }) {
  const { status, generation, usage, error, errorCode } = request;
  const Icon = moduleConfig.icon;

  return (
    <div
      aria-live="polite"
      className="min-h-80 rounded-3xl border border-line bg-white p-5 sm:p-7"
    >
      {status === "idle" && (
        <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
          <span
            className={cn(
              "grid size-14 place-items-center rounded-2xl",
              moduleConfig.theme.soft,
              moduleConfig.theme.text,
            )}
          >
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-ink">Your result will appear here</h2>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            Write your request on the left and press Generate.
          </p>
        </div>
      )}

      {status === "loading" && (
        <div role="status" aria-label="Generating">
          <p className={cn("flex items-center gap-2 text-sm font-medium", moduleConfig.theme.text)}>
            {[0, 1, 2].map((dot) => (
              <motion.span
                key={dot}
                className={cn("size-2 rounded-full", moduleConfig.theme.bar)}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
              />
            ))}
            {moduleConfig.name} is working on it
          </p>
          <p className="mt-2 text-sm text-ink-soft">This can take up to a minute.</p>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-6 h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="flex min-h-72 flex-col items-center justify-center text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-danger/10 text-danger">
            <CircleAlert className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">It did not work</h2>
          <p className="mt-2 max-w-md text-sm text-ink-soft">{error}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {errorCode === "QUOTA_EXCEEDED" ? (
              <Button as={Link} to={ROUTES.subscription}>
                See plans
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={onRetry}
                leftIcon={<RotateCw className="size-4" aria-hidden="true" />}
              >
                Try again
              </Button>
            )}
          </div>
        </div>
      )}

      {status === "success" && generation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className={cn("flex items-center gap-2 text-sm font-semibold", moduleConfig.theme.text)}>
              <Icon className="size-4" aria-hidden="true" />
              {moduleConfig.name}
            </p>
            <div className="flex items-center gap-2">
              <CopyButton text={generation.output} />
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCw className="size-4" aria-hidden="true" />}
              >
                Regenerate
              </Button>
            </div>
          </div>

          <div className="mt-5">
            <MarkdownContent>{generation.output}</MarkdownContent>
          </div>

          <div className="mt-6 space-y-1 border-t border-line pt-4 text-xs text-ink-soft">
            <p>
              Saved to your{" "}
              <Link to={ROUTES.history} className="font-semibold text-primary-600 hover:underline">
                Generation History
              </Link>
              {generation.project ? ` and to the project “${generation.project.name}”.` : "."}
            </p>
            {usage && (
              <p>
                {usage.used} of {usage.limit} generations used this month.
              </p>
            )}
            <p>AI results are drafts. Review them before you use them.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}