import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../../ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { DURATION, EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// Example panel under the service cards. It swaps smoothly when another module is chosen.
export function ModulePreview({ module }) {
  const { user } = useAuth();
  const Icon = module.icon;

  return (
    <div aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={module.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className={cn(
            "grid gap-8 rounded-3xl border border-line p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12",
            module.theme.panel,
          )}
        >
          <div className="flex flex-col items-start justify-center">
            <span
              className={cn(
                "grid size-12 place-items-center rounded-2xl bg-white",
                module.theme.text,
              )}
            >
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-2xl font-semibold text-ink">{module.name}</h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">{module.details}</p>
            <Button as={Link} to={user ? ROUTES.dashboard : ROUTES.signup} className="mt-6">
              Try {module.name}
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-ink-soft">You ask</p>
              <p className="mt-1.5 rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-ink">
                {module.preview.prompt}
              </p>
            </div>
            <div>
              <p className={cn("text-xs font-medium", module.theme.text)}>{module.name} replies</p>
              <ul className="mt-1.5 space-y-2">
                {module.preview.result.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink"
                  >
                    <Check
                      className={cn("mt-0.5 size-4 shrink-0", module.theme.text)}
                      aria-hidden="true"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-ink-soft">Example output for illustration.</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}