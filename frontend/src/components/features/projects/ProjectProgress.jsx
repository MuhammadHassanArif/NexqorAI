import { motion } from "framer-motion";
import { EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// Progress bar that fills smoothly. value is a number from 0 to 100.
export function ProjectProgress({ value, barClass }) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-label="Project progress"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
      >
        <motion.div
          className={cn("h-full rounded-full", barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        />
      </div>
      <span className="w-9 text-right text-xs font-medium tabular-nums text-ink-soft">{percent}%</span>
    </div>
  );
}