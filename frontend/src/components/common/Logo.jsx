import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { ROUTES } from "../../constants/routes";
import logoImg from "../../assets/images/nexusai-icon.png"

// Clicking the logo always opens the Home page at the very top.
export function Logo({ className, to = ROUTES.home }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  const handleClick = (event) => {
    // Let the browser handle Ctrl/Cmd/Shift clicks (open in a new tab or window)
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    if (to !== ROUTES.home) return;

    if (pathname === ROUTES.home) {
      // Already on Home: a normal link would do nothing, so scroll to the top ourselves
      event.preventDefault();
      // Remove a section like "#pricing" from the address bar
      if (hash) navigate(ROUTES.home, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Coming from another page: make sure Home opens at the very top
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      aria-label="NexqorAI, go to the home page"
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary-500",
        className,
      )}
    >
      <img
        src={logoImg}
        alt=""
        width="2377"
        height="700"
        className="h-10 w-auto"
      />
    </Link>
  );
}