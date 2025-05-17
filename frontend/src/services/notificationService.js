import apiClient, { ensureCsrfToken } from "./apiClient";

export const notificationService = {
  getNotifications: async () => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.get("/notifications");
      return response.data;
    } catch (error) {
      console.error(
        "Get notifications error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  markAsRead: async (id) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(
        "Mark as read error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  markAllAsRead: async () => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.put("/notifications/read-all");
      return response.data;
    } catch (error) {
      console.error(
        "Mark all as read error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteNotification: async (id) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete notification error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default notificationService;
