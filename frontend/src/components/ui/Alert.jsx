import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { DURATION, EASE_OUT } from "../../animations/motionPresets";
import { cn } from "../../utils/cn";

// Error box for messages that belong to the whole form (for example "wrong password").
// It opens and closes smoothly, and screen readers announce it when it appears.
export function Alert({ message, className }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "mb-4 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-ink",
              className,
            )}
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
            <p>{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}