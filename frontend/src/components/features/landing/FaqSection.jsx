import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Section } from "../../common/Section";
import { SectionHeading } from "../../common/SectionHeading";
import { Reveal } from "../../animated/Reveal";
import { FAQS } from "../../../constants/faqs";
import { DURATION, EASE_OUT } from "../../../animations/motionPresets";

function FaqItem({ item, open, onToggle }) {
  const buttonId = `faq-button-${item.id}`;
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-500 sm:text-lg"
        >
          {item.question}
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-600">
            <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: DURATION.base }}>
              <Plus className="size-4" aria-hidden="true" />
            </motion.span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-base leading-relaxed text-ink-soft">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  // Only one answer is open at a time
  const [openId, setOpenId] = useState(FAQS[0].id);

  return (
    <Section id="faq" innerClassName="max-w-3xl">
      <Reveal>
        <SectionHeading
          title="Questions before you start"
          description="Short answers about limits, privacy and what to expect from AI results."
        />
      </Reveal>

      <Reveal className="mt-12">
        <div className="rounded-3xl border border-line bg-white px-6 sm:px-8">
          {FAQS.map((item) => (
            <FaqItem
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}