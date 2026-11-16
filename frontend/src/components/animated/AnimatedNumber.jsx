import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

// Shows a number that counts smoothly to its new value whenever "value" changes.
export function AnimatedNumber({ value, className, duration = 0.6 }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [motionValue, value, duration]);

  return <motion.span className={className}>{rounded}</motion.span>;
}