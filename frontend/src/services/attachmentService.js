import apiClient, { ensureCsrfToken } from "./apiClient";

const BASE_URL = "/notes";

export const attachmentService = {
  // List all attachments for a note
  async getAttachments(noteUuid) {
    await ensureCsrfToken();
    try {
      const res = await apiClient.get(`${BASE_URL}/${noteUuid}/attachments`);
      return res.data.attachments;
    } catch (error) {
      console.error(
        "Get attachments error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Upload a new attachment (file: File object)
  async uploadAttachment(noteUuid, file) {
    await ensureCsrfToken();
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post(
        `${BASE_URL}/${noteUuid}/attachments`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return res.data.attachment;
    } catch (error) {
      console.error(
        "Upload attachment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Download/view an attachment (returns a blob)
  async downloadAttachment(noteUuid, attachmentId) {
    await ensureCsrfToken();
    try {
      const res = await apiClient.get(
        `${BASE_URL}/${noteUuid}/attachments/${attachmentId}`,
        {
          responseType: "blob",
        }
      );
      return res;
    } catch (error) {
      console.error(
        "Download attachment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete an attachment
  async deleteAttachment(noteUuid, attachmentId) {
    await ensureCsrfToken();
    try {
      const res = await apiClient.delete(
        `${BASE_URL}/${noteUuid}/attachments/${attachmentId}`
      );
      return res.data;
    } catch (error) {
      console.error(
        "Delete attachment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
