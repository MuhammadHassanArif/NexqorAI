import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarCheck, Code, Palette } from "lucide-react";
import { Button } from "../../ui/Button";
import { HeroDemo } from "./HeroDemo";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../constants/routes";
import { DURATION, EASE_OUT, heroContainer, heroItem } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

// Small chip that floats gently around the demo, like the Build / Create / Plan chips in the Figma hero.
// Chips sit on the top and bottom edges of the demo box, so they never cover its text.
// They are hidden on phones, where there is no free space for them.
function FloatingChip({ icon: Icon, label, iconClass, className, delay = 0 }) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "absolute z-10 hidden items-center gap-2 rounded-2xl bg-white px-3.5 py-2 text-sm font-semibold text-ink shadow-glass sm:flex",
        className,
      )}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Icon className={cn("size-4", iconClass)} />
      {label}
    </motion.div>
  );
}

export function Hero() {
  const { user } = useAuth();

  return (
    <section id="home" className="px-3 pb-6 pt-24 sm:px-4 sm:pt-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-linear-to-br from-primary-900 via-primary-700 to-primary-500 px-5 py-10 sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        {/* soft moving light shapes in the background */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 size-64 rounded-full bg-accent/40 blur-3xl sm:size-96"
          animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-64 rounded-full bg-primary-400/30 blur-3xl sm:size-96"
          animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* minmax(0, ...) lets each column shrink, so the demo can never push the page wider than the screen */}
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
          <motion.div
            className="min-w-0"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={heroItem}
              className="text-balance text-[2rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-5xl sm:leading-[1.1] lg:text-[3.4rem]"
            >
              Plan it, build it and ship it from one AI workspace.
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg"
            >
              NexqorAI brings business analysis, project planning, code, documentation and creative
              assets into a single workspace, so your idea never gets lost between tools.
            </motion.p>

            <motion.div variants={heroItem} className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Button
                as={Link}
                to={user ? ROUTES.dashboard : ROUTES.signup}
                variant="light"
                size="lg"
                className="w-full sm:w-auto"
              >
                {user ? "Open dashboard" : "Start free"}
              </Button>
              <Button
                as={Link}
                to={{ pathname: ROUTES.home, hash: "#services" }}
                variant="glass"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore AI tools
              </Button>
            </motion.div>

            {!user && (
              <motion.p variants={heroItem} className="mt-4 text-sm text-white/70">
                A free plan is available.
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="relative min-w-0"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: DURATION.slow + 0.2, ease: EASE_OUT, delay: 0.35 }}
          >
            <FloatingChip
              icon={Code}
              label="Build"
              iconClass="text-module-code"
              className="-top-6 left-6"
            />
            <FloatingChip
              icon={CalendarCheck}
              label="Plan"
              iconClass="text-module-manager"
              className="-top-6 right-8"
              delay={1.2}
            />
            <FloatingChip
              icon={Palette}
              label="Create"
              iconClass="text-module-studio"
              className="-bottom-6 right-10"
              delay={2.4}
            />
            <HeroDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}