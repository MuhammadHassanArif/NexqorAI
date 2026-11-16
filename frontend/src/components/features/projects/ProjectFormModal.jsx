import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../../ui/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Alert } from "../../ui/Alert";
import { projectSchema } from "../../../utils/projectValidators";
import { projectService } from "../../../services/projectService";
import { toDateInputValue } from "../../../utils/formatDate";
import {
  PROJECT_CATEGORIES,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
  PROJECT_STATUS_LABELS,
} from "../../../constants/projects";
import { cn } from "../../../utils/cn";

// The form inside the window. It is a separate component so it starts fresh every time the window opens.
function ProjectForm({ project, onSaved, onCancel }) {
  const isEdit = Boolean(project);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    mode: "onTouched",
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      category: project?.category ?? "Other",
      dueDate: toDateInputValue(project?.dueDate),
      status: project?.status ?? "in_progress",
    },
  });

  const description = watch("description");

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        dueDate: values.dueDate,
        ...(isEdit ? { status: values.status } : {}),
      };
      const saved = isEdit
        ? await projectService.update(project.id, payload)
        : await projectService.create(payload);
      onSaved(saved);
    } catch (error) {
      if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) =>
          setError(field, { type: "server", message }),
        );
      } else {
        setServerError(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-1">
      <Alert message={serverError} />

      <Input
        label="Project name"
        placeholder="e.g. Customer analytics platform"
        maxLength={PROJECT_NAME_MAX}
        data-autofocus
        error={errors.name?.message}
        {...register("name")}
      />

      <Input as="select" label="Category" error={errors.category?.message} {...register("category")}>
        {PROJECT_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.value}
          </option>
        ))}
      </Input>

      <Input
        as="textarea"
        label="Description (optional)"
        placeholder="What is this project about?"
        maxLength={PROJECT_DESCRIPTION_MAX}
        labelAside={
          <span
            aria-hidden="true"
            className={cn(
              "text-xs tabular-nums",
              description.length >= PROJECT_DESCRIPTION_MAX ? "text-warning" : "text-ink-soft",
            )}
          >
            {description.length}/{PROJECT_DESCRIPTION_MAX}
          </span>
        }
        error={errors.description?.message}
        {...register("description")}
      />

      <Input
        type="date"
        label="Due date (optional)"
        error={errors.dueDate?.message}
        {...register("dueDate")}
      />

      {isEdit && (
        <Input as="select" label="Status" error={errors.status?.message} {...register("status")}>
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Input>
      )}

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save changes" : "Create project"}
        </Button>
      </div>
    </form>
  );
}

// Window for creating a project (no "project" given) or editing one.
export function ProjectFormModal({ open, project, onClose, onSaved }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Edit project" : "Create something amazing"}
      description={
        project
          ? "Change the details of this project."
          : "Start a focused workspace and let NexqorAI help take it from idea to launch."
      }
    >
      <ProjectForm project={project} onSaved={onSaved} onCancel={onClose} />
    </Modal>
  );
}