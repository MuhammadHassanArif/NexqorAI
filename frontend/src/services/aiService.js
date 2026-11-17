import { apiClient } from "./apiClient";

export const aiService = {
  // Returns { generation, usage: { used, limit } }.
  // The AI can take a while, so this call waits up to 90 seconds (the others wait 20).
  async generate({ module, prompt, projectId }) {
    const { data } = await apiClient.post(
      "/ai/generate",
      { module, prompt, projectId: projectId || undefined },
      { timeout: 90000 },
    );
    return data;
  },
};