import apiClient, { ensureCsrfToken } from "./apiClient";

export const labelService = {
  getAllLabels: async () => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.get("/labels");
      return response.data;
    } catch (error) {
      console.error("Get labels error:", error.response?.data || error.message);
      throw error;
    }
  },

  createLabel: async (labelData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/labels", labelData);
      return response.data;
    } catch (error) {
      console.error(
        "Create label error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateLabel: async (id, labelData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.put(`/labels/${id}`, labelData);
      return response.data;
    } catch (error) {
      console.error(
        "Update label error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteLabel: async (id) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.delete(`/labels/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete label error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default labelService;
