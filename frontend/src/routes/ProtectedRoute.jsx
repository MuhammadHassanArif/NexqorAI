import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../constants/routes";

// Wraps pages that need a login (the whole dashboard).
// A visitor who is not logged in is sent to the login page, and after logging in
// the login form brings them back to the page they wanted (it reads location.state.from).
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

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

  if (!user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}