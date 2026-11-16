export const PROJECT_NAME_MAX = 60;
export const PROJECT_DESCRIPTION_MAX = 300;

// Must match PROJECT_CATEGORIES in backend/src/models/Project.js.
// Each category has a fixed color. Class names are written in full so Tailwind can find them.
export const PROJECT_CATEGORIES = [
  { value: "Product development", text: "text-module-analyst", soft: "bg-module-analyst/10", bar: "bg-module-analyst" },
  { value: "Brand strategy", text: "text-module-docs", soft: "bg-module-docs/10", bar: "bg-module-docs" },
  { value: "Web application", text: "text-module-manager", soft: "bg-module-manager/10", bar: "bg-module-manager" },
  { value: "Data platform", text: "text-module-code", soft: "bg-module-code/10", bar: "bg-module-code" },
  { value: "Marketing launch", text: "text-module-analyzer", soft: "bg-module-analyzer/10", bar: "bg-module-analyzer" },
  { value: "Health technology", text: "text-module-studio", soft: "bg-module-studio/10", bar: "bg-module-studio" },
  { value: "Other", text: "text-primary-600", soft: "bg-primary-50", bar: "bg-primary-500" },
];

export const PROJECT_STATUS_LABELS = {
  in_progress: "In progress",
  completed: "Completed",
};

export function getCategoryTheme(category) {
  return PROJECT_CATEGORIES.find((item) => item.value === category) ?? PROJECT_CATEGORIES.at(-1);
}