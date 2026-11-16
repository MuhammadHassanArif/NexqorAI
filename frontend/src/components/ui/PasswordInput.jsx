import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "./Input";

// Password field with a button that shows or hides the password.
export const PasswordInput = forwardRef(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <Input
      ref={ref}
      type={visible ? "text" : "password"}
      icon={Lock}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="grid size-10 place-items-center rounded-lg text-ink-soft outline-offset-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ToggleIcon className="size-5" aria-hidden="true" />
        </button>
      }
      {...props}
    />
  );
});