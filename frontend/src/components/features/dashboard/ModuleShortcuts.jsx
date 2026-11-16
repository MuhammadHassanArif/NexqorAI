import { Link } from "react-router-dom";
import { MODULES } from "../../../constants/modules";
import { ROUTES } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

// Quick links to the AI modules. The colors come from constants/modules.js, like everywhere else.
export function ModuleShortcuts() {
  return (
    <section aria-labelledby="tools-heading">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="tools-heading" className="text-lg font-semibold text-ink sm:text-xl">
            AI tools
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Jump into the assistant you need.</p>
        </div>
        <Link to={ROUTES.modules} className="text-sm font-semibold text-primary-600 hover:underline">
          View all
        </Link>
      </div>

      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MODULES.slice(0, 4).map((module) => {
          const Icon = module.icon;
          return (
            <li key={module.id}>
              <Link
                to={ROUTES.modules}
                className="group flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4 outline-offset-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glass focus-visible:outline-2 focus-visible:outline-primary-500"
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    module.theme.soft,
                    module.theme.text,
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{module.name}</span>
                  <span className="mt-1 block line-clamp-2 text-xs text-ink-soft">
                    {module.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}