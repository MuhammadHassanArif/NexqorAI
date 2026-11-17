import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/common/PageHeader";
import { PromptForm } from "../../components/features/ai/PromptForm";
import { ResultPanel } from "../../components/features/ai/ResultPanel";
import { MODULE_INPUTS } from "../../constants/moduleInputs";
import { getModule } from "../../constants/modules";
import { ROUTES } from "../../constants/routes";
import { useApiData } from "../../hooks/useApiData";
import { usePageTitle } from "../../hooks/usePageTitle";
import { aiService } from "../../services/aiService";
import { projectService } from "../../services/projectService";

const IDLE_REQUEST = { status: "idle", generation: null, usage: null, error: "", errorCode: "" };

function Workspace({ moduleId }) {
  const moduleConfig = getModule(moduleId);
  const inputs = MODULE_INPUTS[moduleId];

  usePageTitle(`${moduleConfig?.name ?? "AI Module"} | NexqorAI`);

  // The projects are only needed for the "Save to a project" list. If loading them fails, the list is just empty.
  const { data: projects } = useApiData(() => projectService.list(), "projects-for-ai");

  const [request, setRequest] = useState(IDLE_REQUEST);
  const lastValuesRef = useRef(null);
  const resultRef = useRef(null);

  const runGenerate = useCallback(
    async (values) => {
      lastValuesRef.current = values;
      setRequest({ ...IDLE_REQUEST, status: "loading" });
      try {
        const { generation, usage } = await aiService.generate({ module: moduleId, ...values });
        setRequest({ ...IDLE_REQUEST, status: "success", generation, usage });
      } catch (error) {
        setRequest({
          ...IDLE_REQUEST,
          status: "error",
          error: error.message,
          errorCode: error.code ?? "",
        });
      }
    },
    [moduleId],
  );

  // On tablets and phones the result is below the form, so scroll down to it
  useEffect(() => {
    if (request.status !== "idle" && window.matchMedia("(max-width: 1023px)").matches) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [request.status]);

  if (!moduleConfig || !inputs?.available) {
    return <Navigate to={ROUTES.modules} replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={ROUTES.modules}
          className="mb-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-ink-soft outline-offset-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          AI Modules
        </Link>
        <PageHeader title={moduleConfig.name} description={moduleConfig.details} />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="rounded-3xl border border-line bg-white p-5 sm:p-7">
          <PromptForm
            inputs={inputs}
            projects={projects ?? []}
            isLoading={request.status === "loading"}
            onSubmit={runGenerate}
          />
        </div>

        <div ref={resultRef} className="scroll-mt-24">
          <ResultPanel
            moduleConfig={moduleConfig}
            request={request}
            onRetry={() => lastValuesRef.current && runGenerate(lastValuesRef.current)}
          />
        </div>
      </div>
    </div>
  );
}

// The key makes a fresh page (empty result) when the visitor opens another module.
export function ModuleWorkspace() {
  const { moduleId } = useParams();
  return <Workspace key={moduleId} moduleId={moduleId} />;
}