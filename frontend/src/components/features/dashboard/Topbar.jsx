import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { UserMenu } from "../landing/UserMenu";
import { ROUTES } from "../../../constants/routes";

// Bar at the top of the dashboard: menu button (small screens), search, and the account menu.
export function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  // The search opens My Projects with the words in the address (?q=...)
  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate({
      pathname: ROUTES.projects,
      search: trimmed ? `?q=${encodeURIComponent(trimmed)}` : "",
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid size-10 shrink-0 place-items-center rounded-xl text-ink outline-offset-2 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <form onSubmit={handleSubmit} role="search" className="relative min-w-0 max-w-md flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={60}
            placeholder="Search projects"
            aria-label="Search projects"
            className="h-10 w-full rounded-xl border border-line bg-canvas pl-10 pr-3 text-base text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink-soft/70 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/15 sm:text-sm"
          />
        </form>

        <div className="ml-auto shrink-0">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}