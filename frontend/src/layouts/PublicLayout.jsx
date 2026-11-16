import { Outlet } from "react-router-dom";
import { Navbar } from "../components/features/landing/Navbar";
import { Footer } from "../components/features/landing/Footer";
import { useScrollToHash } from "../hooks/useScrollToHash";

// Wrapper for public pages: navbar on top, footer at the bottom, page content in between.
export function PublicLayout() {
  useScrollToHash();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-700 focus:shadow-glass"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}