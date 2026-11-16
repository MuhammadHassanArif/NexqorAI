import { SignupForm } from "../../components/features/auth/SignupForm";
import { usePageTitle } from "../../hooks/usePageTitle";

export function Signup() {
  usePageTitle("Sign up | NexqorAI");

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Create your account
      </h1>
      <p className="mb-8 mt-2 text-base text-ink-soft">
        Start planning, building and shipping with NexqorAI.
      </p>
      <SignupForm />
    </div>
  );
}