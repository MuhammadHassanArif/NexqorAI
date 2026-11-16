import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { Reveal } from "../../animated/Reveal";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";

export function CtaBanner() {
  const { user } = useAuth();

  return (
    <section className="px-3 pb-20 sm:px-4 sm:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-linear-to-br from-primary-900 via-primary-700 to-primary-500 px-6 py-14 text-center sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-accent/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Bring your next idea into one workspace
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
              Create a free account and try the modules on a real project.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                as={Link}
                to={user ? ROUTES.dashboard : ROUTES.signup}
                variant="light"
                size="lg"
              >
                {user ? "Open dashboard" : "Create free account"}
              </Button>
              {!user && (
                <Button as={Link} to={ROUTES.login} variant="glass" size="lg">
                  Log in
                </Button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}