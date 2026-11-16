import { Project } from "../models/Project.js";
import { getUsageSummary } from "./usageService.js";

// Everything the Overview page needs, in one request.
export async function getOverview(userId) {
  const [activeProjects, completedProjects, recentProjects, usage] = await Promise.all([
    Project.countDocuments({ user: userId, status: "in_progress" }),
    Project.countDocuments({ user: userId, status: "completed" }),
    Project.find({ user: userId }).sort({ updatedAt: -1 }).limit(5),
    getUsageSummary(userId),
  ]);

  return {
    stats: {
      activeProjects,
      completedProjects,
      generations: usage.used,
      usage,
    },
    recentProjects: recentProjects.map((project) => project.toJSON()),
  };
}