// Shared animation timing and variants. Every component imports from here,
// so the whole site moves in the same way and can be tuned in one place.

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const DURATION = { fast: 0.18, base: 0.28, slow: 0.5 };
export const SPRING = { type: "spring", stiffness: 420, damping: 32 };

export const backdropFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

export const dropdownPanel = {
  hidden: { opacity: 0, y: -6, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  },
  exit: { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } },
};

export const mobilePanel = {
  hidden: { opacity: 0, y: -12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: DURATION.base,
      ease: EASE_OUT,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast } },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const staggerList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// The one orchestrated page-load moment: hero text appears in sequence.
export const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export const heroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

// Short side-to-side shake, used when a form is submitted with errors.
export const shakeAnimation = {
  x: [0, -8, 8, -5, 5, 0],
  transition: { duration: 0.4 },
};