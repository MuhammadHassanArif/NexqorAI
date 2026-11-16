import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useAnimationControls } from "framer-motion";
import { Mail } from "lucide-react";
import { Input } from "../../ui/Input";
import { PasswordInput } from "../../ui/PasswordInput";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { loginSchema } from "../../../utils/validators";
import { authService } from "../../../services/authService";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { shakeAnimation } from "../../../animations/motionPresets";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const shake = useAnimationControls();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    // Show an error after the user leaves a field, then keep checking while they type
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  // If a protected page sent the user here, go back to that page after login
  const redirectTo = location.state?.from?.pathname ?? ROUTES.dashboard;

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { user } = await authService.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: Boolean(values.rememberMe),
      });
      setUser(user);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(error.message || "Something went wrong. Please try again.");
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
        {...register("email")}
      />

      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="size-4 rounded border-line accent-primary-500"
          {...register("rememberMe")}
        />
        Keep me signed in on this device
      </label>

      <Button type="submit" size="lg" loading={isSubmitting} className="mt-5 w-full">
        {isSubmitting ? "Logging in..." : "Log in"}
      </Button>

      <p className="pt-5 text-center text-sm text-ink-soft">
        New to NexqorAI?{" "}
        <Link to={ROUTES.signup} className="font-semibold text-primary-600 hover:underline">
          Create an account
        </Link>
      </p>
    </motion.form>
  );
}