// What each AI module's page needs: a hint for the prompt box and some example requests.
// A module with available: false is shown as "Coming soon" and cannot be opened.
// The ids must match the module ids in constants/modules.js and in the backend (models/Generation.js).
export const MODULE_INPUTS = {
  "business-analyst": {
    available: true,
    placeholder: "Describe your idea or paste the client's brief...",
    examples: [
      "I need an online booking platform for a clinic with doctors, patients and reminders.",
      "A client wants a mobile app for a small gym. Prepare the questions I should ask them.",
    ],
  },
  "project-manager": {
    available: true,
    placeholder: "Paste the project scope and tell me how much time you have...",
    examples: [
      "Plan an 8 week MVP for a clinic booking platform built by one developer.",
      "Break a student portal (login, courses, grades) into phases and tasks.",
    ],
  },
  "code-generator": {
    available: true,
    placeholder: "Say what the code must do, and the language or framework...",
    examples: [
      "Express route that registers a user, with validation and a controller in a separate file.",
      "A React component for a responsive pricing table with a monthly and yearly switch.",
    ],
  },
  "code-analyzer": {
    available: true,
    placeholder: "Paste your code here and say what you want checked...",
    examples: [
      "Review this login controller for security problems: (paste the code after this line)",
      "Check this React component for bugs and performance problems: (paste the code after this line)",
    ],
  },
  documentation: {
    available: true,
    placeholder: "Give the project details and say which document you need...",
    examples: [
      "Write an SRS outline for a clinic booking platform with patients, doctors and admins.",
      "Write an API guide for these endpoints: POST /login, GET /projects, POST /projects.",
    ],
  },
  "creative-studio": { available: false },
};