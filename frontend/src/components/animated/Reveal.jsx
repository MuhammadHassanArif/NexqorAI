import { motion } from "framer-motion";
import { DURATION, EASE_OUT } from "../../animations/motionPresets";

// Fades and lifts its content into view once, the first time it is scrolled to.
export function Reveal({ as = "div", delay = 0, y = 16, className, children }) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}