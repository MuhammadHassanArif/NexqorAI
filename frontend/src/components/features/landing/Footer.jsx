import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Logo } from "../../common/Logo";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

const PRODUCT_LINKS = [
  { label: "Services", to: { pathname: ROUTES.home, hash: "#services" } },
  { label: "How it works", to: { pathname: ROUTES.home, hash: "#how-it-works" } },
  { label: "Pricing", to: { pathname: ROUTES.home, hash: "#pricing" } },
  { label: "FAQ", to: { pathname: ROUTES.home, hash: "#faq" } },
];

function FooterColumn({ title, links }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="rounded text-sm text-ink-soft outline-offset-2 transition-colors hover:text-primary-600 focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  const accountLinks = user
    ? [
        { label: "Dashboard", to: ROUTES.dashboard },
        { label: "Settings", to: ROUTES.settings },
      ]
    : [
        { label: "Log in", to: ROUTES.login },
        { label: "Sign up", to: ROUTES.signup },
      ];

  return (
    <footer className="border-t border-line bg-white px-4 pb-8 pt-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              One AI workspace for planning, building, documenting and designing your projects.
            </p>
          </div>
          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Account" links={accountLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
          <p>© {year} NexqorAI. All rights reserved.</p>
          <p>AI results can contain mistakes. Review them before you use them.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 font-medium text-ink outline-offset-2 transition-colors hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-primary-500 md:self-auto"
          >
            Back to top
            <ArrowUp
              className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}