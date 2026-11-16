import { LoginForm } from "../../components/features/auth/LoginForm";
import { usePageTitle } from "../../hooks/usePageTitle";

export function Login() {
  usePageTitle("Log in | NexqorAI");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Welcome back</h1>
      <p className="mb-8 mt-2 text-base text-ink-soft">Log in to continue to your workspace.</p>
      <LoginForm />
    </div>
  );
}