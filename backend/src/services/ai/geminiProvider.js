import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 60000;

// Every provider has the same three members: name, isConfigured() and generate().
// To add another company (for example OpenAI), create a file like this one and list it in aiProvider.js.
export const geminiProvider = {
  name: "gemini",

  isConfigured() {
    return Boolean(env.geminiApiKey && env.geminiModel);
  },

  // Sends one prompt and returns { text, model }
  async generate({ systemPrompt, prompt }) {
    const url = `${BASE_URL}/${encodeURIComponent(env.geminiModel)}:generateContent`;

    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": env.geminiApiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        throw new ApiError(504, "The AI took too long to answer. Please try again.", {
          code: "AI_TIMEOUT",
        });
      }
      console.error("Gemini request failed:", error.message);
      throw new ApiError(503, "Could not reach the AI service. Please try again.", {
        code: "AI_UNREACHABLE",
      });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // The details go to the server log only. The user gets a short, safe message.
      console.error("Gemini error:", response.status, data?.error?.message ?? "");

      if (response.status === 429) {
        throw new ApiError(503, "The AI service is busy right now. Please try again in a minute.", {
          code: "AI_BUSY",
        });
      }
      if ([400, 401, 403, 404].includes(response.status)) {
        // Usually a wrong GEMINI_API_KEY, or a GEMINI_MODEL that does not exist (any more)
        throw new ApiError(503, "The AI service is not set up correctly.", {
          code: "AI_NOT_CONFIGURED",
        });
      }
      throw new ApiError(502, "The AI service had a problem. Please try again.", {
        code: "AI_ERROR",
      });
    }

    const candidate = data?.candidates?.[0];
    const text = (candidate?.content?.parts ?? [])
      .filter((part) => part.thought !== true)
      .map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) {
      // The AI refused to answer (safety filter) or returned nothing
      throw new ApiError(422, "The AI could not answer this request. Try changing your words.", {
        code: "AI_BLOCKED",
      });
    }

    return { text, model: env.geminiModel };
  },
};