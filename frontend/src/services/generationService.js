import { apiClient } from "./apiClient";

// The saved AI results (the history).
export const generationService = {
  // The list does not contain the long "output" text. Use get(id) to open one result.
  async list({ favorite = false } = {}) {
    const { data } = await apiClient.get("/generations", {
      params: favorite ? { favorite: "true" } : {},
    });
    return data.generations;
  },

  async get(id) {
    const { data } = await apiClient.get(`/generations/${id}`);
    return data.generation;
  },

  async update(id, values) {
    const { data } = await apiClient.patch(`/generations/${id}`, values);
    return data.generation;
  },

  async remove(id) {
    await apiClient.delete(`/generations/${id}`);
  },
};