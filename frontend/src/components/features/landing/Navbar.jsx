import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "../../common/Logo";
import { NavLinks } from "./NavLinks";
import { NavActions } from "./NavActions";
import { MobileMenu, MOBILE_MENU_ID } from "./MobileMenu";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { SECTION_IDS } from "../../../constants/navLinks";
import { ROUTES } from "../../../constants/routes";
import { DURATION, EASE_OUT } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const SCROLL_THRESHOLD = 12;
const DESKTOP_QUERY = "(min-width: 1024px)";

// Fixed navbar for the public pages.
// At the top of the page it is transparent. After scrolling it becomes a frosted white bar.
export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === ROUTES.home;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const spyId = useScrollSpy(SECTION_IDS, { enabled: isHome });
  const activeId = isHome ? spyId : null;
  const showSurface = scrolled || menuOpen;

  useLockBodyScroll(menuOpen);

  // Remember whether the page has been scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Close the mobile menu if the window becomes desktop sized
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto w-full max-w-6xl px-3 pt-3 sm:px-4">
        <motion.nav
          aria-label="Main"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border px-3 transition-[background-color,border-color,box-shadow,padding] duration-300 sm:px-4",
            showSurface
              ? "border-line bg-white/80 py-1.5 shadow-glass backdrop-blur-xl"
              : "border-transparent bg-transparent py-2.5",
          )}
        >
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <NavLinks activeId={activeId} />

          <div className="flex flex-1 items-center justify-end">
            <div className="hidden lg:block">
              <NavActions />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_MENU_ID}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-xl text-ink outline-offset-2 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={menuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                  className="grid place-items-center"
                >
                  {menuOpen ? (
                    <X className="size-5" aria-hidden="true" />
                  ) : (
                    <Menu className="size-5" aria-hidden="true" />
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.nav>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} activeId={activeId} />
      </div>
    </header>
  );
}