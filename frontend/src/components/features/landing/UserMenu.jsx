import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { UserAvatar } from "../../common/UserAvatar";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { dropdownPanel } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const ITEM_CLASS =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-primary-50 focus-visible:bg-primary-50 focus-visible:outline-none";

// Avatar button with a small account menu (shown only when the user is logged in).
export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click and on Escape
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!user) return null;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate(ROUTES.home);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-1 pr-2 outline-offset-2 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500"
      >
        <UserAvatar name={user.name} size="sm" />
        <ChevronDown
          className={cn("size-4 text-ink-soft transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-line bg-white p-2 shadow-glass"
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <UserAvatar name={user.name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-soft">{user.email}</p>
              </div>
            </div>

            <div className="my-1 h-px bg-line" />

            <Link to={ROUTES.dashboard} onClick={() => setOpen(false)} className={ITEM_CLASS}>
              <LayoutDashboard className="size-4 text-ink-soft" aria-hidden="true" />
              Dashboard
            </Link>
            <Link to={ROUTES.settings} onClick={() => setOpen(false)} className={ITEM_CLASS}>
              <Settings className="size-4 text-ink-soft" aria-hidden="true" />
              Settings
            </Link>
            <button type="button" onClick={handleLogout} className={ITEM_CLASS}>
              <LogOut className="size-4 text-ink-soft" aria-hidden="true" />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}