import { forwardRef, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { cn } from "../../utils/cn";

// Text field with a label, an optional icon, and a reserved space for its error or hint.
// Because that space is always reserved, the form does not jump when an error appears.
// It can also be a textarea or a select:  <Input as="textarea" />   <Input as="select">...options...</Input>
export const Input = forwardRef(function Input(
  {
    as: Control = "input",
    label,
    error,
    hint,
    icon: Icon,
    rightSlot,
    labelAside,
    describedBy,
    id,
    className,
    children,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasError = Boolean(error);
  const describedByIds = [messageId, describedBy].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        {labelAside}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-soft"
            aria-hidden="true"
          />
        )}

        {/* text-base (16px) stops iPhones from zooming into the field when it is tapped */}
        <Control
          ref={ref}
          id={inputId}
          aria-invalid={hasError || undefined}
          aria-describedby={describedByIds}
          className={cn(
            "w-full rounded-xl border bg-white text-base text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-ink-soft/60 focus:ring-4",
            Control === "textarea" ? "min-h-28 resize-y py-3" : "h-12",
            Icon ? "pl-12" : "pl-4",
            rightSlot ? "pr-12" : "pr-4",
            hasError
              ? "border-danger focus:border-danger focus:ring-danger/15"
              : "border-line hover:border-primary-300 focus:border-primary-500 focus:ring-primary-500/15",
          )}
          {...props}
        >
          {children}
        </Control>

        {rightSlot && <div className="absolute inset-y-0 right-1.5 flex items-center">{rightSlot}</div>}
      </div>

      <div id={messageId} aria-live="polite" className="mt-1.5 min-h-5 text-sm">
        <AnimatePresence mode="wait" initial={false}>
          {hasError ? (
            <motion.p
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-start gap-1.5 text-danger"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.p>
          ) : hint ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {hint}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
});