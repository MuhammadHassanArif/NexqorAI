import { Building2, Laptop, Rocket, Terminal } from "lucide-react";
import { Section } from "../../common/Section";
import { SectionHeading } from "../../common/SectionHeading";
import { Reveal } from "../../animated/Reveal";
import { getModule } from "../../../constants/modules";
import { cn } from "../../../utils/cn";

const USE_CASES = [
  {
    title: "Freelancers",
    description: "Turn a client brief into a clear scope, a proposal draft and a delivery plan.",
    icon: Laptop,
    modules: ["business-analyst", "project-manager", "creative-studio"],
  },
  {
    title: "Software developers",
    description: "Draft code, get a second look at your own, and keep technical docs current.",
    icon: Terminal,
    modules: ["code-generator", "code-analyzer", "documentation"],
  },
  {
    title: "Small agencies",
    description: "Keep every client project, task and generated document in one place.",
    icon: Building2,
    modules: ["project-manager", "documentation", "business-analyst"],
  },
  {
    title: "Startup founders",
    description: "Move from a rough idea to a scoped plan and the documents to share it.",
    icon: Rocket,
    modules: ["business-analyst", "project-manager", "documentation"],
  },
];

export function UseCases() {
  return (
    <Section id="use-cases">
      <Reveal>
        <SectionHeading
          title="Built for people who deliver projects"
          description="Whether you work alone or with clients, NexqorAI keeps the work connected."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map((useCase, index) => {
          const Icon = useCase.icon;
          return (
            <Reveal key={useCase.title} delay={(index % 4) * 0.07} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 transition-colors duration-300 hover:border-primary-300">
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-50 text-primary-600">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{useCase.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {useCase.description}
                </p>

                <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
                  {useCase.modules.map((moduleId) => {
                    const module = getModule(moduleId);
                    return (
                      <li key={moduleId} className="flex items-center gap-2 text-sm text-ink">
                        <span
                          className={cn("size-2 shrink-0 rounded-full", module.theme.bar)}
                          aria-hidden="true"
                        />
                        {module.name}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}