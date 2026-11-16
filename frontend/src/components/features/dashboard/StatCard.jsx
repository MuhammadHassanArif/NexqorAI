import { motion } from "framer-motion";
import { AnimatedNumber } from "../../animated/AnimatedNumber";
import { Skeleton } from "../../ui/Skeleton";
import { EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// One number card of the Overview page. Give "progress" (0-100) to show a bar under the number.
export function StatCard({ icon: Icon, label, value, suffix = "", note, iconClass, progress, isLoading }) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", iconClass)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-medium text-ink-soft">{label}</p>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="mt-4 h-9 w-24" />
          <Skeleton className="mt-3 h-4 w-32" />
        </>
      ) : (
        <>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-ink">
            <AnimatedNumber value={value} />
            {suffix}
          </p>

          {progress !== undefined && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progress)}%` }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />
            </div>
          )}

          {note && <p className="mt-2 text-xs text-ink-soft">{note}</p>}
        </>
      )}
    </div>
  );
}