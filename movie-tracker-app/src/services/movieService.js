import api from "../api";

function unwrapResponse(response) {
  const body = response.data;
  return {
    success: body?.success ?? true,
    data: body?.data ?? body,
    message: body?.message,
  };
}

function getErrorMessage(error, fallback) {
  const data = error.response?.data;
  if (typeof data === "string") return data;
  return data?.message || fallback;
}

export const movieService = {
  async getAll() {
    try {
      const response = await api.get("/watchedmovie");
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to load movies") };
    }
  },

  async create(movie) {
    try {
      const response = await api.post("/watchedmovie", movie);
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to add movie") };
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/watchedmovie/${id}`, data);
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to update movie") };
    }
  },

  async delete(id) {
    try {
      await api.delete(`/watchedmovie/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to delete movie") };
    }
  },

  async getStats() {
    try {
      const response = await api.get("/watchedmovie/stats");
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to load stats") };
    }
  },
};
