import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";

// Later this limit can depend on the user's plan
const MAX_PROJECTS_PER_USER = 100;

// Finds a project only if it belongs to this user. Otherwise the answer is "not found",
// so nobody can find out whether somebody else's project id exists.
async function getOwnedProject(userId, projectId) {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new ApiError(404, "Project not found.", { code: "NOT_FOUND" });
  }
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) {
    throw new ApiError(404, "Project not found.", { code: "NOT_FOUND" });
  }
  return project;
}

export async function listProjects(userId) {
  const projects = await Project.find({ user: userId })
    .sort({ updatedAt: -1 })
    .limit(MAX_PROJECTS_PER_USER);
  return projects.map((project) => project.toJSON());
}

export async function createProject(userId, data) {
  const count = await Project.countDocuments({ user: userId });
  if (count >= MAX_PROJECTS_PER_USER) {
    throw new ApiError(403, `You can have at most ${MAX_PROJECTS_PER_USER} projects.`, {
      code: "PROJECT_LIMIT",
    });
  }

  const project = await Project.create({ ...data, user: userId });
  return project.toJSON();
}

export async function getProject(userId, projectId) {
  const project = await getOwnedProject(userId, projectId);
  return project.toJSON();
}

export async function updateProject(userId, projectId, data) {
  const project = await getOwnedProject(userId, projectId);

  const { status, ...otherFields } = data;
  project.set(otherFields);

  if (status === "completed") {
    project.status = "completed";
    project.progress = 100;
  } else if (status === "in_progress") {
    // Re-opening a finished project: the progress goes back to 0 until tasks calculate it
    if (project.status === "completed") project.progress = 0;
    project.status = "in_progress";
  }

  await project.save();
  return project.toJSON();
}

export async function deleteProject(userId, projectId) {
  const project = await getOwnedProject(userId, projectId);
  await project.deleteOne();
}