// PLACEHOLDER limits and prices. Decide the real ones before launch and change them here only:
// the Home page and the future Subscription page both read from this file.
export const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Try the text modules on a real project.",
    price: { monthly: 0, yearly: 0 },
    cta: "Start free",
    features: [
      "500 AI generations each month",
      "Up to 3 projects",
      "Business Analyst, Project Manager, Documentation and Code modules",
      "Generation history",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    featured: true,
    description: "For people who ship with AI every week.",
    price: { monthly: 19, yearly: 15 },
    cta: "Choose Pro",
    features: [
      "5,000 AI generations each month",
      "Unlimited projects",
      "All six modules, including Creative Studio",
      "Export where supported",
      "Priority processing",
    ],
  },
  {
    id: "team",
    name: "Team",
    comingSoon: true,
    description: "Shared workspaces for small agencies.",
    price: null,
    cta: "Coming soon",
    features: ["Shared projects and history", "Roles and invitations", "Team usage overview"],
  },
];