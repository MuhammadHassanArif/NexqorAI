import mongoose from "mongoose";
import { Generation } from "../models/Generation.js";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { MODULE_PROMPTS } from "./ai/prompts.js";

const LIST_LIMIT = 100;

// Turns generations into plain objects for the frontend, with the project's name attached.
export async function serializeGenerations(userId, generations) {
  const projectIds = [
    ...new Set(generations.map((item) => item.project?.toString()).filter(Boolean)),
  ];
  const projects = projectIds.length
    ? await Project.find({ _id: { $in: projectIds }, user: userId }).select("name")
    : [];
  const names = new Map(projects.map((project) => [project.id, project.name]));

  return generations.map((item) => {
    const json = item.toJSON();
    const projectId = item.project?.toString();
    json.project = projectId && names.has(projectId) ? { id: projectId, name: names.get(projectId) } : null;
    return json;
  });
}

// Finds a visible, finished generation that belongs to this user (same rule as projects)
async function getOwnedGeneration(userId, generationId) {
  if (!mongoose.isValidObjectId(generationId)) {
    throw new ApiError(404, "Result not found.", { code: "NOT_FOUND" });
  }
  const generation = await Generation.findOne({
    _id: generationId,
    user: userId,
    status: "completed",
    isHidden: false,
  });
  if (!generation) {
    throw new ApiError(404, "Result not found.", { code: "NOT_FOUND" });
  }
  return generation;
}

// The list leaves out the long "output" text, it is loaded only when someone opens a result
export async function listGenerations(userId, { favorite = false, module } = {}) {
  const filter = { user: userId, status: "completed", isHidden: false };
  if (favorite) filter.favorite = true;
  if (module && MODULE_PROMPTS[module]) filter.module = module;

  const generations = await Generation.find(filter)
    .select("-output")
    .sort({ createdAt: -1 })
    .limit(LIST_LIMIT);

  return serializeGenerations(userId, generations);
}

export async function getGeneration(userId, generationId) {
  const generation = await getOwnedGeneration(userId, generationId);
  const [serialized] = await serializeGenerations(userId, [generation]);
  return serialized;
}

export async function updateGeneration(userId, generationId, { favorite }) {
  const generation = await getOwnedGeneration(userId, generationId);
  generation.favorite = favorite;
  await generation.save();
  const [serialized] = await serializeGenerations(userId, [generation]);
  return serialized;
}

// Only hides it. See isHidden in the model for the reason.
export async function deleteGeneration(userId, generationId) {
  const generation = await getOwnedGeneration(userId, generationId);
  generation.isHidden = true;
  await generation.save();
}