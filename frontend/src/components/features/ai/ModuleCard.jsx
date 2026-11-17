import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { cn } from "../../../utils/cn";

// One module on the AI Modules page. An unavailable module is shown but cannot be opened.
export function ModuleCard({ module, available }) {
  const Icon = module.icon;

  const content = (
    <>
      <span className={cn("absolute inset-x-0 top-0 h-1", module.theme.bar)} aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn("grid size-12 place-items-center rounded-2xl", module.theme.soft, module.theme.text)}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>
        {!available && (
          <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
            Coming soon
          </span>
        )}
      </div>

      <h2 className="mt-5 text-lg font-semibold text-ink">{module.name}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{module.description}</p>

      {available && (
        <span className={cn("mt-5 inline-flex items-center gap-1.5 text-sm font-semibold", module.theme.text)}>
          Open tool
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      )}
    </>
  );

  const baseClass =
    "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-6";

  if (!available) {
    return <div className={cn(baseClass, "opacity-70")}>{content}</div>;
  }

  return (
    <Link
      to={`${ROUTES.modules}/${module.id}`}
      className={cn(
        baseClass,
        "outline-offset-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass focus-visible:outline-2 focus-visible:outline-primary-500",
      )}
    >
      {content}
    </Link>
  );
}