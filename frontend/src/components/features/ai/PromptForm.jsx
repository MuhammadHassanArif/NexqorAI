import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { generateSchema, PROMPT_MAX_LENGTH } from "../../../utils/aiValidators";
import { cn } from "../../../utils/cn";

// The box where the user describes what they need, and the Generate button.
// It only collects and checks the input. The page decides what happens with it (onSubmit).
export function PromptForm({ inputs, projects, isLoading, onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(generateSchema),
    mode: "onTouched",
    defaultValues: { prompt: "", projectId: "" },
  });

  const prompt = watch("prompt");
  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <form onSubmit={submit} noValidate className="space-y-1">
      <Input
        as="textarea"
        rows={9}
        label="Your request"
        placeholder={inputs.placeholder}
        maxLength={PROMPT_MAX_LENGTH}
        labelAside={
          <span
            aria-hidden="true"
            className={cn(
              "text-xs tabular-nums",
              prompt.length >= PROMPT_MAX_LENGTH ? "text-warning" : "text-ink-soft",
            )}
          >
            {prompt.length.toLocaleString()}/{PROMPT_MAX_LENGTH.toLocaleString()}
          </span>
        }
        error={errors.prompt?.message}
        // Ctrl+Enter (or Cmd+Enter on Mac) sends the request
        onKeyDown={(event) => {
          if ((event.ctrlKey || event.metaKey) && event.key === "Enter") submit();
        }}
        {...register("prompt")}
      />

      <div className="pb-3">
        <p className="text-xs font-medium text-ink-soft">Try an example</p>
        <div className="mt-2 flex flex-col gap-2">
          {inputs.examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setValue("prompt", example, { shouldValidate: true, shouldDirty: true })}
              className="rounded-xl border border-line bg-white px-3 py-2 text-left text-xs leading-relaxed text-ink-soft outline-offset-2 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <Input as="select" label="Save to a project (optional)" {...register("projectId")}>
        <option value="">No project</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </Input>

      <Button
        type="submit"
        size="lg"
        loading={isLoading}
        leftIcon={<Sparkles className="size-4" aria-hidden="true" />}
        className="w-full"
      >
        {isLoading ? "Generating..." : "Generate"}
      </Button>
      <p className="pt-2 text-center text-xs text-ink-soft">
        Every result is saved to your Generation History.
      </p>
    </form>
  );
}