import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { getModule } from "../../../constants/modules";
import { useTypewriter } from "../../../hooks/useTypewriter";
import { staggerItem, staggerList } from "../../../animations/motionPresets";
import { cn } from "../../../utils/cn";

const DEMO_MODULES = ["business-analyst", "project-manager", "code-analyzer"].map(getModule);

// Shorter tab labels for narrow phone screens
const SHORT_LABELS = {
  "business-analyst": "Analyst",
  "project-manager": "Manager",
  "code-analyzer": "Analyzer",
};

const THINKING_MS = 700;
const RESULT_HOLD_MS = 5200;

// Long text must wrap inside its box instead of pushing outside it
const WRAP = "[overflow-wrap:anywhere]";

// The list of result lines for one module.
// All three lists are always rendered on top of each other in the same grid cell.
// Only the active one is visible, but the cell is always as tall as the tallest list,
// so the layout never jumps and nothing can overlap the text below.
function ResultList({ module, shown }) {
  return (
    <motion.ul
      aria-hidden={!shown}
      variants={staggerList}
      initial="hidden"
      animate={shown ? "visible" : "hidden"}
      className={cn("col-start-1 row-start-1 space-y-2", !shown && "invisible")}
    >
      {module.preview.result.map((line) => (
        <motion.li
          key={line}
          variants={staggerItem}
          className="flex gap-2.5 rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink"
        >
          <Check className={cn("mt-0.5 size-4 shrink-0", module.theme.text)} aria-hidden="true" />
          <span className={cn("min-w-0", WRAP)}>{line}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

// A small live demo: a prompt is typed, the module "thinks", then its result appears.
// It cycles through three modules, and visitors can pick one themselves.
// The text shown here is only example content, it does not call the backend.
export function HeroDemo() {
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);
  // typing -> thinking -> result
  const [phase, setPhase] = useState(reduceMotion ? "result" : "typing");

  const activeModule = DEMO_MODULES[index];

  const typedPrompt = useTypewriter(activeModule.preview.prompt, {
    enabled: phase === "typing",
    speed: 28,
    onDone: () => setPhase("thinking"),
  });

  // Move through the phases, and on to the next module when the result has been shown
  useEffect(() => {
    if (phase === "thinking") {
      const timer = setTimeout(() => setPhase("result"), THINKING_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "result" && !reduceMotion) {
      const timer = setTimeout(() => {
        setIndex((current) => (current + 1) % DEMO_MODULES.length);
        setPhase("typing");
      }, RESULT_HOLD_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [phase, index, reduceMotion]);

  const selectModule = (nextIndex) => {
    setIndex(nextIndex);
    setPhase(reduceMotion ? "result" : "typing");
  };

  return (
    <div className="w-full min-w-0 rounded-3xl bg-white p-3 shadow-[0_30px_80px_-30px_rgba(10,5,40,0.7)] sm:p-4">
      {/* Module tabs: three equal columns, so labels can never push the box wider */}
      <div
        role="group"
        aria-label="Example modules"
        className="grid grid-cols-3 gap-1 rounded-2xl bg-canvas p-1"
      >
        {DEMO_MODULES.map((item, itemIndex) => {
          const Icon = item.icon;
          const isActive = itemIndex === index;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={isActive}
              aria-label={item.name}
              onClick={() => selectModule(itemIndex)}
              className={cn(
                "flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-1.5 py-2 text-xs font-semibold outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 sm:gap-2 sm:px-3 sm:text-sm",
                isActive ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-ink",
              )}
            >
              <Icon className={cn("size-4 shrink-0", item.theme.text)} aria-hidden="true" />
              <span className="truncate sm:hidden">{SHORT_LABELS[item.id]}</span>
              <span className="hidden truncate sm:inline">{item.name}</span>
            </button>
          );
        })}
      </div>

      <div className="px-1 pb-1 pt-4 sm:px-3 sm:pb-2">
        <p className="text-xs font-medium text-ink-soft">You ask</p>

        {/* Invisible copies of every prompt reserve the height of the longest one,
            so the box does not grow line by line while the text is being typed. */}
        <div className="mt-1.5 grid rounded-2xl bg-primary-50 px-4 py-3 text-sm leading-relaxed text-ink">
          {DEMO_MODULES.map((item) => (
            <span
              key={item.id}
              aria-hidden="true"
              className={cn("invisible col-start-1 row-start-1", WRAP)}
            >
              {item.preview.prompt}
            </span>
          ))}
          <span className={cn("col-start-1 row-start-1", WRAP)}>
            {typedPrompt}
            {phase === "typing" && (
              <span
                className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary-500 align-middle"
                aria-hidden="true"
              />
            )}
          </span>
        </div>

        <div className="mt-4" aria-live="polite">
          <p className={cn("flex items-center gap-2 text-xs font-medium", activeModule.theme.text)}>
            <span className={cn("size-2 rounded-full", activeModule.theme.bar)} aria-hidden="true" />
            {activeModule.name} replies
          </p>

          <div className="mt-2 grid">
            {DEMO_MODULES.map((item) => (
              <ResultList
                key={item.id}
                module={item}
                shown={phase === "result" && item.id === activeModule.id}
              />
            ))}

            {phase === "thinking" && (
              <div
                className="col-start-1 row-start-1 flex gap-1.5 pt-2"
                role="status"
                aria-label="Generating"
              >
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className={cn("size-2 rounded-full", activeModule.theme.bar)}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-xs text-ink-soft">Example output for illustration.</p>
      </div>
    </div>
  );
}