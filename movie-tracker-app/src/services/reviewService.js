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

export const reviewService = {
  async getAll() {
    try {
      const response = await api.get("/review");
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to load reviews") };
    }
  },

  async create(review) {
    try {
      const response = await api.post("/review", review);
      return unwrapResponse(response);
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Failed to add review") };
    }
  },
};
