import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import { geminiProvider } from "./geminiProvider.js";

// The list of AI companies we can use. AI_PROVIDER in .env chooses one.
// The rest of the app only calls getAiProvider().generate(...), so switching company
// never touches a controller or a page.
const PROVIDERS = { gemini: geminiProvider };

export function getAiProvider() {
  const provider = PROVIDERS[env.aiProvider];

  if (!provider || !provider.isConfigured()) {
    console.error(
      `AI provider "${env.aiProvider}" is not set up. Check AI_PROVIDER, GEMINI_API_KEY and GEMINI_MODEL in backend/.env`,
    );
    throw new ApiError(503, "The AI service is not set up yet.", { code: "AI_NOT_CONFIGURED" });
  }

  return provider;
}