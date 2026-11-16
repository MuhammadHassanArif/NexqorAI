import { AnimatePresence, motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { evaluatePassword } from "../../../utils/validators";
import { DURATION, EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const LEVELS = {
  weak: { label: "Weak", bar: "bg-danger", text: "text-danger" },
  fair: { label: "Fair", bar: "bg-warning", text: "text-warning" },
  good: { label: "Good", bar: "bg-primary-500", text: "text-primary-600" },
  strong: { label: "Strong", bar: "bg-success", text: "text-success" },
};

const SEGMENTS = [0, 1, 2, 3];

// Strength bar plus a checklist that ticks each rule while the user types.
export function PasswordStrength({ password, id }) {
  const { rules, level, filledSegments } = evaluatePassword(password);
  const info = LEVELS[level];

  return (
    <AnimatePresence initial={false}>
      {password.length > 0 && (
        <motion.div
          id={id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          <div className="pb-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden="true">
                {SEGMENTS.map((segment) => (
                  <span
                    key={segment}
                    className={cn(
                      "h-1.5 rounded-full transition-colors duration-300",
                      segment < filledSegments ? info.bar : "bg-line",
                    )}
                  />
                ))}
              </div>
              <span className={cn("w-14 text-right text-xs font-semibold", info.text)}>
                <span className="sr-only">Password strength: </span>
                {info.label}
              </span>
            </div>

            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className={cn(
                    "flex items-center gap-1.5 text-xs transition-colors duration-200",
                    rule.passed ? "text-success" : "text-ink-soft",
                  )}
                >
                  {rule.passed ? (
                    <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />
                  )}
                  <span className="sr-only">{rule.passed ? "Done: " : "Missing: "}</span>
                  {rule.label}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}