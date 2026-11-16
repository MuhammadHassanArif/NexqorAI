import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../ui/Button";
import { ROUTES } from "../../../constants/routes";

// The purple banner at the top of the Overview page (from the Figma design).
export function OverviewBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-900 via-primary-700 to-primary-500 px-6 py-8 text-white sm:px-10 sm:py-10">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/40 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 16, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative max-w-xl">
        <h2 className="text-balance text-2xl font-semibold leading-tight sm:text-3xl">
          Turn your next big idea into something brilliant.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
          Plan, build, analyze and create with six AI assistants that share your projects.
        </p>
        <Button as={Link} to={ROUTES.modules} variant="light" className="mt-6">
          Explore AI tools
        </Button>
      </div>
    </section>
  );
}