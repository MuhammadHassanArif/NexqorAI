import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimationControls } from "framer-motion";
import { Mail, Sparkles, User } from "lucide-react";
import { Input } from "../../ui/Input";
import { PasswordInput } from "../../ui/PasswordInput";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { PasswordStrength } from "./PasswordStrength";
import {
  NAME_MAX_LENGTH,
  PASSWORDS_MISMATCH_MESSAGE,
  signupSchema,
  suggestEmailDomain,
} from "../../../utils/validators";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";
import { PLANS } from "../../../constants/plans";
import { ROUTES } from "../../../constants/routes";
import { shakeAnimation } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const PASSWORD_HELP_ID = "signup-password-help";

export function SignupForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const shake = useAnimationControls();

  // The pricing buttons open this page with ?plan=pro.
  // Only plan ids that really exist are accepted, text from the address bar is never trusted.
  const selectedPlan = PLANS.find(
    (plan) => plan.id === searchParams.get("plan") && plan.id !== "free" && !plan.comingSoon,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    trigger,
    setError,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const fullName = watch("fullName");
  const email = watch("email");
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  const emailSuggestion = useMemo(() => suggestEmailDomain(email), [email]);

  // When the password changes, check the "confirm password" field again
  useEffect(() => {
    if (getValues("confirmPassword")) trigger("confirmPassword");
  }, [password, getValues, trigger]);

  // The "passwords match" rule only runs once every other field is valid,
  // so we also show the mismatch message live after the user has left the confirm field.
  const confirmMismatch =
    touchedFields.confirmPassword && confirmPassword.length > 0 && confirmPassword !== password;
  const confirmError =
    errors.confirmPassword?.message || (confirmMismatch ? PASSWORDS_MISMATCH_MESSAGE : "");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      // confirmPassword is only for the form, it is never sent to the backend
      const { user } = await authService.signup({
        fullName: values.fullName.trim().replace(/\s+/g, " "),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        plan: selectedPlan?.id,
      });
      setUser(user);
      navigate(ROUTES.dashboard, { replace: true });
    } catch (error) {
      if (error.fieldErrors) {
        // The backend pointed at specific fields, so show the message under them
        Object.entries(error.fieldErrors).forEach(([field, message]) =>
          setError(field, { type: "server", message }),
        );
      } else {
        setServerError(error.message || "Something went wrong. Please try again.");
      }
      shake.start(shakeAnimation);
    }
  };

  const onInvalid = () => {
    shake.start(shakeAnimation);
  };

  return (
    <motion.form
      animate={shake}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="space-y-1"
    >
      <Alert message={serverError} />

      {selectedPlan && (
        <p className="mb-4 flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-700">
          <Sparkles className="size-4 shrink-0" aria-hidden="true" />
          You picked the {selectedPlan.name} plan. You can change it any time.
        </p>
      )}

      <Input
        label="Full name"
        icon={User}
        placeholder="Your full name"
        autoComplete="name"
        maxLength={NAME_MAX_LENGTH}
        labelAside={
          <span
            aria-hidden="true"
            className={cn(
              "text-xs tabular-nums",
              fullName.length >= NAME_MAX_LENGTH ? "text-warning" : "text-ink-soft",
            )}
          >
            {fullName.length}/{NAME_MAX_LENGTH}
          </span>
        }
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Email"
        type="email"
        icon={Mail}
        placeholder="name@gmail.com"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        error={errors.email?.message}
        hint={
          emailSuggestion ? (
            <button
              type="button"
              onClick={() =>
                setValue("email", emailSuggestion, { shouldValidate: true, shouldDirty: true })
              }
              className="text-left text-primary-600 hover:underline"
            >
              Did you mean <span className="font-semibold">{emailSuggestion}</span>?
            </button>
          ) : undefined
        }
        {...register("email")}
      />

      <PasswordInput
        label="Password"
        placeholder="Create a strong password"
        autoComplete="new-password"
        describedBy={PASSWORD_HELP_ID}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordStrength id={PASSWORD_HELP_ID} password={password} />

      <PasswordInput
        label="Confirm password"
        placeholder="Type the password again"
        autoComplete="new-password"
        error={confirmError}
        {...register("confirmPassword")}
      />

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-4 w-full">
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>

      <p className="pt-5 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link to={ROUTES.login} className="font-semibold text-primary-600 hover:underline">
          Log in
        </Link>
      </p>
    </motion.form>
  );
}