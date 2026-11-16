// Shown when a list has nothing to show yet.
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-primary-200 bg-white px-6 py-14 text-center">
      {Icon && (
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Icon className="size-7" aria-hidden="true" />
        </span>
      )}
      <h2 className="mt-5 text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}