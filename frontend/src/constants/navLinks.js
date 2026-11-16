// Each link scrolls to the section on the Home page whose id equals sectionId.
export const NAV_LINKS = [
  { id: "home", label: "Home", sectionId: "home" },
  { id: "services", label: "Services", sectionId: "services" },
  { id: "how-it-works", label: "How it works", sectionId: "how-it-works" },
  { id: "pricing", label: "Pricing", sectionId: "pricing" },
  { id: "faq", label: "FAQ", sectionId: "faq" },
];

// Defined once at module level so the array reference never changes between renders.
export const SECTION_IDS = NAV_LINKS.map((link) => link.sectionId);