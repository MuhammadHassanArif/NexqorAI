import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Section } from "../../common/Section";
import { SectionHeading } from "../../common/SectionHeading";
import { Reveal } from "../../animated/Reveal";
import { AnimatedNumber } from "../../animated/AnimatedNumber";
import { Button } from "../../ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import { PLANS } from "../../../constants/plans";
import { ROUTES } from "../../../constants/routes";
import { SPRING } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const BILLING_OPTIONS = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

function PlanCard({ plan, billing, signedIn }) {
  const featured = Boolean(plan.featured);
  const target = signedIn
    ? ROUTES.dashboard
    : plan.id === "free"
      ? ROUTES.signup
      : `${ROUTES.signup}?plan=${plan.id}`;

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border p-7",
        featured
          ? "border-transparent bg-linear-to-br from-primary-800 via-primary-700 to-primary-500 text-white shadow-glass lg:-translate-y-3"
          : "border-line bg-canvas",
      )}
    >
      {featured && (
        <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      )}

      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className={cn("mt-2 text-sm", featured ? "text-white/80" : "text-ink-soft")}>
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        {plan.price ? (
          <>
            <span className="text-4xl font-semibold">
              $<AnimatedNumber value={plan.price[billing]} />
            </span>
            <span className={cn("text-sm", featured ? "text-white/70" : "text-ink-soft")}>/month</span>
          </>
        ) : (
          <span className="text-4xl font-semibold">Soon</span>
        )}
      </div>
      <p className={cn("mt-1 h-5 text-xs", featured ? "text-white/70" : "text-ink-soft")}>
        {plan.price && plan.price.monthly > 0
          ? billing === "yearly"
            ? "Billed once a year"
            : "Billed monthly"
          : ""}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm">
            <Check
              className={cn("mt-0.5 size-4 shrink-0", featured ? "text-white" : "text-primary-600")}
              aria-hidden="true"
            />
            <span className={featured ? "text-white/90" : "text-ink"}>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.comingSoon ? (
        <Button variant="outline" disabled className="mt-8 w-full">
          {plan.cta}
        </Button>
      ) : (
        <Button
          as={Link}
          to={target}
          variant={featured ? "light" : "outline"}
          className="mt-8 w-full"
        >
          {signedIn ? "Open dashboard" : plan.cta}
        </Button>
      )}
    </article>
  );
}

export function PricingPreview() {
  const { user } = useAuth();
  const [billing, setBilling] = useState("monthly");

  const featuredPlan = PLANS.find((plan) => plan.featured);
  const yearlySavings = featuredPlan
    ? Math.round((1 - featuredPlan.price.yearly / featuredPlan.price.monthly) * 100)
    : 0;

  return (
    <Section id="pricing" className="bg-white">
      <Reveal>
        <SectionHeading
          title="Start free, upgrade when you need more"
          description="Plans are based on how many AI generations you use each month."
        />
      </Reveal>

      <div className="mt-10 flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="Billing period"
          className="inline-flex rounded-full border border-line bg-canvas p-1"
        >
          {BILLING_OPTIONS.map((option) => {
            const isActive = billing === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setBilling(option.id)}
                className="relative rounded-full px-5 py-2 text-sm font-semibold outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-500"
              >
                {isActive && (
                  <motion.span
                    layoutId="billing-pill"
                    transition={SPRING}
                    className="absolute inset-0 rounded-full bg-primary-500"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 transition-colors",
                    isActive ? "text-white" : "text-ink-soft",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-soft">Yearly billing saves about {yearlySavings}% on Pro.</p>
      </div>

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {PLANS.map((plan, index) => (
          <Reveal key={plan.id} delay={index * 0.08} className="h-full">
            <PlanCard plan={plan} billing={billing} signedIn={Boolean(user)} />
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-soft">
        Image and video generation depends on provider access and can use separate credits.
      </p>
    </Section>
  );
}