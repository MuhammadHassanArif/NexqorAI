import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { SidebarContent } from "./Sidebar";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { DURATION, EASE_OUT, backdropFade } from "../../../animations/motionPresets";

const DESKTOP_QUERY = "(min-width: 1024px)";

// The sidebar for tablets and phones: it slides in from the left, over the page.
export function MobileSidebar({ open, onClose }) {
  useLockBodyScroll(open);

  // Close with Escape, and when the window becomes desktop sized
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => {
      if (event.matches) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onChange);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          variants={backdropFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
          aria-hidden="true"
        />
      )}

      {open && (
        <motion.aside
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
          className="fixed inset-y-0 left-0 z-50 w-[85%] max-w-xs bg-white shadow-glass lg:hidden"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-3 top-4 z-10 grid size-10 place-items-center rounded-xl text-ink-soft outline-offset-2 transition-colors hover:bg-primary-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <SidebarContent onNavigate={onClose} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}