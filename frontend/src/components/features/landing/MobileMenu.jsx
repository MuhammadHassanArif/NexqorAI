import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "../../ui/Button";
import { UserAvatar } from "../../common/UserAvatar";
import { useAuth } from "../../../hooks/useAuth";
import { NAV_LINKS } from "../../../constants/navLinks";
import { ROUTES } from "../../../constants/routes";
import { backdropFade, mobilePanel, staggerItem } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

export const MOBILE_MENU_ID = "mobile-menu";

// Menu for phones and tablets. It drops down from the navbar and its items appear one by one.
export function MobileMenu({ open, onClose, activeId }) {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate(ROUTES.home);
  };

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
          className="fixed inset-0 -z-10 bg-ink/30 backdrop-blur-[2px] lg:hidden"
          aria-hidden="true"
        />
      )}

      {open && (
        <motion.div
          key="panel"
          id={MOBILE_MENU_ID}
          variants={mobilePanel}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-x-3 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-line bg-white p-3 shadow-glass sm:inset-x-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeId === link.id;
              return (
                <motion.li key={link.id} variants={staggerItem}>
                  <Link
                    to={{ pathname: ROUTES.home, hash: `#${link.sectionId}` }}
                    onClick={onClose}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                      isActive ? "bg-primary-50 text-primary-700" : "text-ink hover:bg-primary-50/70",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="size-2 rounded-full bg-primary-500" aria-hidden="true" />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          <motion.div variants={staggerItem} className="mt-3 border-t border-line pt-3">
            {isLoading ? (
              <div className="h-11 animate-pulse rounded-xl bg-primary-100/70" aria-hidden="true" />
            ) : user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-2 pb-1">
                  <UserAvatar name={user.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-soft">{user.email}</p>
                  </div>
                </div>
                <Button
                  as={Link}
                  to={ROUTES.dashboard}
                  onClick={onClose}
                  leftIcon={<LayoutDashboard className="size-4" aria-hidden="true" />}
                >
                  Dashboard
                </Button>
                <Button
                  variant="soft"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="size-4" aria-hidden="true" />}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button as={Link} to={ROUTES.login} variant="soft" onClick={onClose}>
                  Log in
                </Button>
                <Button as={Link} to={ROUTES.signup} onClick={onClose}>
                  Sign up
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}