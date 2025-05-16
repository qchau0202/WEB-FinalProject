import apiClient, { ensureCsrfToken } from "./apiClient";

export const noteService = {
  getAllNotes: async () => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.get("/notes");
      return response.data;
    } catch (error) {
      console.error("Get notes error:", error.response?.data || error.message);
      throw error;
    }
  },

  createNote: async (noteData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/notes", noteData);
      return response.data;
    } catch (error) {
      console.error(
        "Create note error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getNote: async (uuid) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.get(`/notes/${uuid}`);
      return response.data;
    } catch (error) {
      console.error("Get note error:", error.response?.data || error.message);
      throw error;
    }
  },

  updateNote: async (uuid, noteData) => {
    await ensureCsrfToken();
    try {
      // Always send attachments as an array, never null
      if ("attachments" in noteData && noteData.attachments == null) {
        noteData.attachments = [];
      }

      // If we're disabling the lock feature, we need to handle the password
      if (noteData.lock_feature_enabled === false && noteData.password) {
        noteData.current_password = noteData.password;
        delete noteData.password;
      }

      const response = await apiClient.put(`/notes/${uuid}`, noteData);
      return response.data;
    } catch (error) {
      console.error(
        "Update note error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteNote: async (uuid) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.delete(`/notes/${uuid}`);
      return response.data;
    } catch (error) {
      console.error(
        "Delete note error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  addCollaborator: async (noteUuid, collaboratorData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post(
        `/notes/${noteUuid}/collaborators`,
        collaboratorData
      );
      return response.data;
    } catch (error) {
      console.error(
        "Add collaborator error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  removeCollaborator: async (noteUuid, userId) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.delete(
        `/notes/${noteUuid}/collaborators/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Remove collaborator error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  uploadAttachment: async (noteUuid, file) => {
    await ensureCsrfToken();
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post(
        `/notes/${noteUuid}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Upload attachment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteAttachment: async (noteUuid, attachmentId) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.delete(
        `/notes/${noteUuid}/attachments/${attachmentId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Delete attachment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Lock-related methods
  enableLockFeature: async (noteUuid) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post(`/notes/${noteUuid}/lock/enable`);
      return response.data;
    } catch (error) {
      console.error(
        "Enable lock feature error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  disableLockFeature: async (noteUuid, currentPassword) => {
    await ensureCsrfToken();
    try {
      const data = currentPassword ? { current_password: currentPassword } : {};
      const response = await apiClient.post(
        `/notes/${noteUuid}/lock/disable`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(
        "Disable lock feature error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  lockNote: async (noteUuid, password) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post(`/notes/${noteUuid}/lock/toggle`, {
        password: password,
        is_locked: true,
        current_password: null,
      });
      return response.data;
    } catch (error) {
      console.error("Lock note error:", error.response?.data || error.message);
      throw error;
    }
  },

  unlockNote: async (noteUuid, currentPassword) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post(`/notes/${noteUuid}/lock/toggle`, {
        current_password: currentPassword,
        is_locked: false,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Unlock note error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  verifyLockPassword: async (noteUuid, password) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post(`/notes/${noteUuid}/lock/verify`, {
        password: password,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Verify lock password error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default noteService;
