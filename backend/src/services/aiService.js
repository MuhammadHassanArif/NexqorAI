import mongoose from "mongoose";
import { Generation } from "../models/Generation.js";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { getAiProvider } from "./ai/aiProvider.js";
import { MODULE_PROMPTS } from "./ai/prompts.js";
import { serializeGenerations } from "./generationService.js";
import { getUsageSummary } from "./usageService.js";

// The whole path of one AI request:
// check module and project -> check the monthly limit -> ask the AI -> save -> answer.
export async function generate(userId, { module, prompt, projectId }) {
  const moduleConfig = MODULE_PROMPTS[module];
  if (!moduleConfig) {
    throw new ApiError(400, "This module is not available.", { code: "BAD_MODULE" });
  }

  const provider = getAiProvider();

  // A result can be saved against one of the user's own projects
  let project = null;
  if (projectId) {
    if (mongoose.isValidObjectId(projectId)) {
      project = await Project.findOne({ _id: projectId, user: userId }).select("name");
    }
    if (!project) {
      throw new ApiError(404, "Project not found.", {
        code: "NOT_FOUND",
        fieldErrors: { projectId: "Project not found." },
      });
    }
  }

  const usage = await getUsageSummary(userId);
  if (usage.used >= usage.limit) {
    throw new ApiError(
      429,
      `You have used all ${usage.limit} generations of this month. Upgrade your plan or try again next month.`,
      { code: "QUOTA_EXCEEDED" },
    );
  }

  // Saved as "pending" before the AI is called, so the request already counts as used
  // while it is running (two requests at the same moment cannot both slip under the limit).
  const generation = await Generation.create({
    user: userId,
    project: project?._id ?? null,
    module,
    prompt,
    status: "pending",
    provider: provider.name,
  });

  const startedAt = Date.now();
  try {
    const { text, model } = await provider.generate({
      systemPrompt: moduleConfig.systemPrompt,
      prompt,
    });
    generation.output = text;
    generation.model = model;
    generation.status = "completed";
    generation.durationMs = Date.now() - startedAt;
    await generation.save();
  } catch (error) {
    // A failed request does not count as used
    generation.status = "failed";
    generation.errorMessage = String(error.message ?? "").slice(0, 300);
    generation.durationMs = Date.now() - startedAt;
    await generation.save().catch(() => {});
    throw error;
  }

  const [serialized] = await serializeGenerations(userId, [generation]);
  return { generation: serialized, usage: { used: usage.used + 1, limit: usage.limit } };
}