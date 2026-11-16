import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/features/dashboard/Sidebar";
import { MobileSidebar } from "../components/features/dashboard/MobileSidebar";
import { Topbar } from "../components/features/dashboard/Topbar";

// Wrapper for every dashboard page.
//   Laptop / PC (1024px and up): fixed sidebar on the left.
//   Tablet and phone: the sidebar is a menu that slides in when the menu button is pressed.
export function DashboardLayout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Every new page starts at the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-canvas">
      <Sidebar />
      <MobileSidebar open={menuOpen} onClose={closeMenu} />

      <div className="lg:pl-72">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}