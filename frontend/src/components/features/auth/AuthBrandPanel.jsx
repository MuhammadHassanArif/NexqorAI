import { motion } from "framer-motion";
import { Logo } from "../../common/Logo";
import { MODULES } from "../../../constants/modules";
import { staggerItem, staggerList } from "../../../animations/motionPresets";

// Purple side panel of the login and sign up pages. It is only shown on large screens (laptop and PC).
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary-900 via-primary-700 to-primary-500 p-10 text-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between xl:p-14">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/40 blur-3xl"
        animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-primary-400/30 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The logo has dark text, so it sits on a white chip to stay readable on purple */}
      <div className="relative">
        <div className="inline-flex rounded-2xl bg-white px-4 py-2 shadow-glass">
          <Logo />
        </div>
      </div>

      <div className="relative">
        <h2 className="max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
          One workspace for every part of your project.
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 xl:text-lg">
          Plan, build, review and document with six AI modules that share the same project.
        </p>

        <motion.ul
          variants={staggerList}
          initial="hidden"
          animate="visible"
          className="mt-8 grid max-w-md grid-cols-2 gap-3"
        >
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <motion.li
                key={module.id}
                variants={staggerItem}
                className="flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-2.5 text-sm font-medium backdrop-blur"
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{module.name}</span>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <p className="relative text-sm text-white/70">
        AI results are drafts. Review them before you use them.
      </p>
    </aside>
  );
}