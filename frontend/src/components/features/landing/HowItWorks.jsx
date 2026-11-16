import { useRef } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { BookmarkCheck, FolderPlus, LayoutGrid, Sparkles } from "lucide-react";
import { Section } from "../../common/Section";
import { SectionHeading } from "../../common/SectionHeading";
import { cn } from "../../../utils/cn";

const STEPS = [
  {
    title: "Create a project",
    description: "Name your idea and add the details once. Every module can reuse them.",
    icon: FolderPlus,
  },
  {
    title: "Choose an AI module",
    description: "Pick the specialist you need: analysis, planning, code, documentation or visuals.",
    icon: LayoutGrid,
  },
  {
    title: "Generate and refine",
    description: "Describe the goal, read the draft and regenerate until it fits what you need.",
    icon: Sparkles,
  },
  {
    title: "Review and save",
    description: "Edit the result, save it to the project and export it where supported.",
    icon: BookmarkCheck,
  },
];

function Step({ step, index }) {
  const ref = useRef(null);
  // The number fills with color once the step has scrolled into the middle of the screen
  const reached = useInView(ref, { margin: "0px 0px -45% 0px", once: true });
  const Icon = step.icon;

  return (
    <li ref={ref} className="relative pb-10 pl-16 last:pb-0">
      <span
        className={cn(
          "absolute left-0 top-5 grid size-10 place-items-center rounded-full border-2 text-sm font-semibold transition-colors duration-500",
          reached
            ? "border-primary-500 bg-primary-500 text-white"
            : "border-line bg-white text-ink-soft",
        )}
      >
        {index + 1}
      </span>

      <div className="rounded-3xl border border-line bg-canvas p-6 transition-shadow duration-300 hover:shadow-glass">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">{step.description}</p>
      </div>
    </li>
  );
}

export function HowItWorks() {
  const trackRef = useRef(null);

  // The purple line grows as the visitor scrolls down through the steps
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <Section id="how-it-works" className="bg-white">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            align="left"
            title="From a rough idea to a saved result in four steps"
            description="One simple flow for every module, so you always know what comes next."
          />
        </div>

        <div ref={trackRef} className="relative">
          <div
            className="absolute bottom-8 left-5 top-10 w-0.5 -translate-x-1/2 rounded-full bg-line"
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-full origin-top rounded-full bg-primary-500"
              style={{ scaleY }}
            />
          </div>

          <ol className="relative">
            {STEPS.map((step, index) => (
              <Step key={step.title} step={step} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}