import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { DURATION, EASE_OUT } from "../../animations/motionPresets";
import { cn } from "../../utils/cn";

// Pop-up window built on the browser's own <dialog> element.
// The browser traps the keyboard focus inside it and closes it with Escape.
// The content is only created while the window is open, so a form inside it starts fresh every time.
// Add the attribute data-autofocus to the field that should be selected first.
export function Modal({ open, onClose, title, description, children, className }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useLockBodyScroll(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the dark area around the window lands on the <dialog> itself
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        "m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl bg-white p-0 text-ink shadow-glass backdrop:bg-ink/40 backdrop:backdrop-blur-sm",
        className,
      )}
    >
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="p-5 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-xl font-semibold text-ink sm:text-2xl">
                {title}
              </h2>
              {description && <p className="mt-1.5 text-sm text-ink-soft">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-xl text-ink-soft outline-offset-2 transition-colors hover:bg-primary-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </motion.div>
      )}
    </dialog>
  );
}