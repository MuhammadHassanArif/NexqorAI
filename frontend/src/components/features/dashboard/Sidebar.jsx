import { Link, NavLink } from "react-router-dom";
import { CircleHelp, FolderKanban, History, LayoutGrid, Settings, Sparkles } from "lucide-react";
import { Logo } from "../../common/Logo";
import { UserAvatar } from "../../common/UserAvatar";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

const MAIN_LINKS = [
  { to: ROUTES.dashboard, label: "Overview", icon: LayoutGrid, end: true },
  { to: ROUTES.projects, label: "My Projects", icon: FolderKanban },
  { to: ROUTES.modules, label: "AI Modules", icon: Sparkles },
  { to: ROUTES.history, label: "Generation History", icon: History },
];

const ACCOUNT_LINKS = [
  { to: ROUTES.settings, label: "Settings", icon: Settings },
  { to: ROUTES.help, label: "Help & Support", icon: CircleHelp },
];

function SidebarLink({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500",
          isActive
            ? "bg-primary-50 text-primary-700"
            : "text-ink-soft hover:bg-primary-50/60 hover:text-ink",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn("size-5", isActive ? "text-primary-600" : "text-ink-soft group-hover:text-ink")}
            aria-hidden="true"
          />
          {label}
        </>
      )}
    </NavLink>
  );
}

function LinkGroup({ title, links, onNavigate }) {
  return (
    <div>
      <p className="px-3 text-xs font-medium text-ink-soft">{title}</p>
      <ul className="mt-2 space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <SidebarLink {...link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// The content of the sidebar. It is used twice: fixed on large screens, and inside the slide-in menu on small screens.
export function SidebarContent({ onNavigate }) {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
      <div className="px-1">
        <Logo />
      </div>

      <nav aria-label="Dashboard" className="flex flex-col gap-6">
        <LinkGroup title="Main menu" links={MAIN_LINKS} onNavigate={onNavigate} />
        <LinkGroup title="Your account" links={ACCOUNT_LINKS} onNavigate={onNavigate} />
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <Link
          to={ROUTES.subscription}
          onClick={onNavigate}
          className="rounded-2xl bg-linear-to-br from-primary-50 to-primary-100 p-4 outline-offset-2 transition-shadow hover:shadow-glass focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary-500 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Go limitless with Pro</p>
          <p className="mt-1 text-xs text-ink-soft">More generations and all six modules.</p>
        </Link>

        {user && (
          <div className="flex items-center gap-3 border-t border-line px-1 pt-4">
            <UserAvatar name={user.name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fixed sidebar for laptop and PC screens (1024px and up).
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-white lg:block">
      <SidebarContent />
    </aside>
  );
}