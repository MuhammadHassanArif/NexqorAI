import { Briefcase, CalendarCheck, Code, FileText, Palette, ScanSearch } from "lucide-react";

// The six AI modules. Each one has a fixed color, so it looks the same on every page.
// Class names are written out in full so Tailwind can detect them.
export const MODULES = [
  {
    id: "business-analyst",
    name: "Business Analyst",
    description: "Turn rough ideas and client briefs into clear requirements and proposal drafts.",
    details:
      "Describe the idea once. Get requirements, user roles, assumptions and the questions worth asking your client.",
    icon: Briefcase,
    theme: {
      text: "text-module-analyst",
      bar: "bg-module-analyst",
      soft: "bg-module-analyst/10",
      ring: "ring-module-analyst",
      panel: "bg-module-analyst/5",
    },
    preview: {
      prompt: "I need an online booking platform for a clinic.",
      result: [
        "Roles: patient, doctor and admin",
        "Core modules: booking, reminders and records",
        "3 questions to confirm with the client",
      ],
    },
  },
  {
    id: "project-manager",
    name: "Project Manager",
    description: "Build practical roadmaps, milestones and task plans in a few clicks.",
    details:
      "Start from an approved scope and get phases, priorities and tasks. You stay in control of every date and status.",
    icon: CalendarCheck,
    theme: {
      text: "text-module-manager",
      bar: "bg-module-manager",
      soft: "bg-module-manager/10",
      ring: "ring-module-manager",
      panel: "bg-module-manager/5",
    },
    preview: {
      prompt: "Plan the clinic platform as an 8 week MVP.",
      result: [
        "Weeks 1-2: sign up, login and patient records",
        "Weeks 3-5: appointment booking flow",
        "Weeks 6-8: reminders, testing and launch",
      ],
    },
  },
  {
    id: "code-generator",
    name: "Code Generator",
    description: "Create clean code drafts and starter components from plain language prompts.",
    details:
      "Choose a language and framework, describe what you need, and get code with the assumptions listed for review.",
    icon: Code,
    theme: {
      text: "text-module-code",
      bar: "bg-module-code",
      soft: "bg-module-code/10",
      ring: "ring-module-code",
      panel: "bg-module-code/5",
    },
    preview: {
      prompt: "Create an Express route that registers a user.",
      result: [
        "Route, controller and validation in separate files",
        "Password hashed before it is saved",
        "Assumptions listed for you to review",
      ],
    },
  },
  {
    id: "code-analyzer",
    name: "Code Analyzer",
    description: "Find likely bugs, security risks and improvements in your own code.",
    details:
      "Paste code and get findings with severity labels and suggested fixes. It supports your review, it does not replace it.",
    icon: ScanSearch,
    theme: {
      text: "text-module-analyzer",
      bar: "bg-module-analyzer",
      soft: "bg-module-analyzer/10",
      ring: "ring-module-analyzer",
      panel: "bg-module-analyzer/5",
    },
    preview: {
      prompt: "Review my login controller for security problems.",
      result: [
        "High: no limit on repeated login attempts",
        "Medium: error reveals whether the email exists",
        "Low: unused variable in the token helper",
      ],
    },
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Generate SRS outlines, guides and API documentation drafts from your project.",
    details:
      "Turn approved project details into structured documents, then edit, regenerate and keep versions together.",
    icon: FileText,
    theme: {
      text: "text-module-docs",
      bar: "bg-module-docs",
      soft: "bg-module-docs/10",
      ring: "ring-module-docs",
      panel: "bg-module-docs/5",
    },
    preview: {
      prompt: "Write the API guide for the booking endpoints.",
      result: [
        "Endpoint list with methods and paths",
        "Request and response examples",
        "Setup steps for a new developer",
      ],
    },
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    description: "Create images, and short video clips where your provider allows it, from a prompt.",
    details:
      "Describe the visual you need and get concepts you can save to the project. Video depends on provider access.",
    icon: Palette,
    theme: {
      text: "text-module-studio",
      bar: "bg-module-studio",
      soft: "bg-module-studio/10",
      ring: "ring-module-studio",
      panel: "bg-module-studio/5",
    },
    preview: {
      prompt: "A calm hero image for a clinic booking app.",
      result: [
        "Three image concepts in your brand colors",
        "Size options for web and mobile",
        "A short video clip if your provider supports it",
      ],
    },
  },
];

export function getModule(id) {
  return MODULES.find((module) => module.id === id);
}