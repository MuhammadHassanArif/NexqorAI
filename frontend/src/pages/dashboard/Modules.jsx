import { PageHeader } from "../../components/common/PageHeader";
import { ModuleCard } from "../../components/features/ai/ModuleCard";
import { MODULES } from "../../constants/modules";
import { MODULE_INPUTS } from "../../constants/moduleInputs";
import { usePageTitle } from "../../hooks/usePageTitle";

export function Modules() {
  usePageTitle("AI Modules | NexqorAI");

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI superpowers"
        description="Six specialized assistants, built for your complete workflow."
      />

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {MODULES.map((module) => (
          <li key={module.id}>
            <ModuleCard module={module} available={Boolean(MODULE_INPUTS[module.id]?.available)} />
          </li>
        ))}
      </ul>
    </div>
  );
}