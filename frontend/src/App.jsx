import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { CircleHelp, CreditCard, History, Settings, Sparkles } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { PublicLayout } from "./layouts/PublicLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { PublicOnlyRoute } from "./routes/PublicOnlyRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Home } from "./pages/public/Home";
import { Login } from "./pages/auth/Login";
import { Signup } from "./pages/auth/Signup";
import { Overview } from "./pages/dashboard/Overview";
import { Projects } from "./pages/dashboard/Projects";
import { ComingSoon } from "./pages/dashboard/ComingSoon";
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    // reducedMotion="user" turns off movement for people who enabled "reduce motion" on their device
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.home} element={<Home />} />
            </Route>

            <Route element={<PublicOnlyRoute />}>
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.login} element={<Login />} />
                <Route path={ROUTES.signup} element={<Signup />} />
              </Route>
            </Route>

            {/* Everything under /dashboard needs a login.
                To add a page: create it in pages/dashboard, add a route here and a link in the Sidebar. */}
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="projects" element={<Projects />} />
                <Route
                  path="modules"
                  element={
                    <ComingSoon
                      title="AI Modules"
                      icon={Sparkles}
                      description="The six AI assistants will open here."
                    />
                  }
                />
                <Route
                  path="history"
                  element={
                    <ComingSoon
                      title="Generation History"
                      icon={History}
                      description="Your saved AI results will appear here."
                    />
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ComingSoon
                      title="Settings"
                      icon={Settings}
                      description="Profile and notification settings are coming soon."
                    />
                  }
                />
                <Route
                  path="help"
                  element={
                    <ComingSoon
                      title="Help & Support"
                      icon={CircleHelp}
                      description="Guides and support will be added here."
                    />
                  }
                />
                <Route
                  path="subscription"
                  element={
                    <ComingSoon
                      title="Subscription"
                      icon={CreditCard}
                      description="Plans, usage and billing will be available here."
                    />
                  }
                />
                <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MotionConfig>
  );
}