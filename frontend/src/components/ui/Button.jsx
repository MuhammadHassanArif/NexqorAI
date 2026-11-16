import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-primary-500 text-white shadow-[0_8px_20px_-8px_rgba(105,61,217,0.7)] hover:bg-primary-600 focus-visible:outline-primary-500",
  soft: "bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:outline-primary-500",
  outline:
    "border border-line bg-white text-ink hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-primary-500",
  ghost: "text-ink hover:bg-primary-50 focus-visible:outline-primary-500",
  // For dark purple backgrounds
  light:
    "bg-white text-primary-700 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:bg-primary-50 focus-visible:outline-white",
  glass:
    "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:outline-white",
};

const SIZES = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "h-11 gap-2 px-5 text-sm",
  lg: "h-12 gap-2 px-7 text-base",
};

// Works as a <button> by default. Pass as={Link} and "to" to render a router link instead.
export const Button = forwardRef(function Button(
  {
    as: Component = "button",
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    ...props
  },
  ref,
) {
  const isNativeButton = Component === "button";
  const buttonProps = isNativeButton
    ? { type: props.type ?? "button", disabled: props.disabled || loading }
    : {};

  return (
    <Component
      ref={ref}
      aria-busy={loading || undefined}
      className={cn(
        "group inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl font-semibold outline-offset-2 transition-all duration-200 focus-visible:outline-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
      {...buttonProps}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </Component>
  );
});