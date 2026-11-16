import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

// Wraps pages like Login and Sign up. A user who is already logged in is sent to the dashboard.
export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  // While the backend is still confirming the login, show a small spinner
  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <span
          role="status"
          aria-label="Loading"
          className="size-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-500"
        />
      </div>
    );
  }

  if (user) return <Navigate to={ROUTES.dashboard} replace />;

  return <Outlet />;
}