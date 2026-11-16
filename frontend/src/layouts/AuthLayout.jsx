import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "../components/common/Logo";
import { AuthBrandPanel } from "../components/features/auth/AuthBrandPanel";
import { ROUTES } from "../constants/routes";
import { DURATION, EASE_OUT } from "../animations/motionPresets";

// Wrapper for the login and sign up pages.
//   Laptop / PC (1024px and up): purple brand panel on the left, form on the right.
//   Tablet and phone: only the form, centered, with the logo on top.
export function AuthLayout() {
  const { pathname } = useLocation();

  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <AuthBrandPanel />

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:justify-end lg:px-12">
          <Logo className="lg:hidden" />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink-soft outline-offset-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-start justify-center px-5 pb-10 pt-2 sm:px-8 sm:pt-6 lg:items-center lg:pt-2">
          {/* The key makes the form fade in again when switching between login and sign up */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}