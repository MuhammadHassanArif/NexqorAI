import { apiClient } from "./apiClient";

// All calls about projects. Pages use these functions and never talk to Axios directly.
export const projectService = {
  async list() {
    const { data } = await apiClient.get("/projects");
    return data.projects;
  },

  async create(values) {
    const { data } = await apiClient.post("/projects", values);
    return data.project;
  },

  async update(id, values) {
    const { data } = await apiClient.patch(`/projects/${id}`, values);
    return data.project;
  },

  async remove(id) {
    await apiClient.delete(`/projects/${id}`);
  },
};