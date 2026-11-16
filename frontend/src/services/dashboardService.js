import { apiClient } from "./apiClient";

export const dashboardService = {
  // { stats: { activeProjects, completedProjects, generations, usage: { used, limit } }, recentProjects }
  async getOverview() {
    const { data } = await apiClient.get("/dashboard/overview");
    return data;
  },
};