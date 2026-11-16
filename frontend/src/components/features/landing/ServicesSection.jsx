import { useState } from "react";
import { Section } from "../../common/Section";
import { SectionHeading } from "../../common/SectionHeading";
import { Reveal } from "../../animated/Reveal";
import { ServiceCard } from "./ServiceCard";
import { ModulePreview } from "./ModulePreview";
import { MODULES } from "../../../constants/modules";

export function ServicesSection() {
  const [selectedId, setSelectedId] = useState(MODULES[0].id);
  const selectedModule = MODULES.find((module) => module.id === selectedId);

  return (
    <Section id="services">
      <Reveal>
        <SectionHeading
          title="Six AI modules, one workspace"
          description="Pick the specialist you need. Every module works on the same project, so your context carries over."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module, index) => (
          <Reveal key={module.id} delay={(index % 3) * 0.07} className="h-full">
            <ServiceCard
              module={module}
              selected={module.id === selectedId}
              onSelect={() => setSelectedId(module.id)}
            />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <ModulePreview module={selectedModule} />
      </Reveal>
    </Section>
  );
}