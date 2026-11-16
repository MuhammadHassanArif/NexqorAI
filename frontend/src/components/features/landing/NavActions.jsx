import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Button } from "../../ui/Button";
import { UserMenu } from "./UserMenu";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

// Right side of the desktop navbar. It changes with the login state:
// loading -> placeholder, logged in -> Dashboard + avatar, logged out -> Log in + Sign up.
export function NavActions() {
  const { user, isLoading } = useAuth();

  // While the backend is still confirming the login, show a placeholder so the buttons
  // do not flash from "Log in" to "Dashboard".
  if (isLoading) {
    return <div className="h-10 w-44 animate-pulse rounded-xl bg-primary-100/70" aria-hidden="true" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          as={Link}
          to={ROUTES.dashboard}
          leftIcon={<LayoutDashboard className="size-4" aria-hidden="true" />}
        >
          Dashboard
        </Button>
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button as={Link} to={ROUTES.login} variant="ghost">
        Log in
      </Button>
      <Button
        as={Link}
        to={ROUTES.signup}
        rightIcon={
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        }
      >
        Sign up
      </Button>
    </div>
  );
}