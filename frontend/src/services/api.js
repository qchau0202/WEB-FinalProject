// // api.js
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // Helper to get CSRF token and set it in axios headers
// const ensureCsrfToken = async () => {
//   const { data } = await apiClient.get("/csrf-token");
//   apiClient.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
// };

// // Response Interceptor: Handle 401 errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !window.location.pathname.includes("/login") &&
//       !window.location.pathname.includes("/reset-password") &&
//       !window.location.pathname.includes("/reset-password-otp")
//     ) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export const authService = {
//   login: async (credentials) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/login", credentials);
//       return response.data;
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   register: async (userData) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/register", userData);
//       return response.data;
//     } catch (error) {
//       console.error("Registration error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   activate: async (token) => {
//     try {
//       const response = await apiClient.get(`/activate/${token}`);
//       return response.data;
//     } catch (error) {
//       console.error("Activation error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   resendVerification: async (email) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/resend-verification", { email });
//       return response.data;
//     } catch (error) {
//       console.error("Resend verification error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   getCurrentUser: async () => {
//     const response = await apiClient.get("/user");
//     return response.data;
//   },

//   logout: async () => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/logout");
//       return response.data;
//     } catch (error) {
//       console.error("Logout error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   requestPasswordReset: async ({ email, method }) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/request-password-reset", {
//         email,
//         method,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Request password reset error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   verifyOtp: async ({ email, otp }) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/verify-otp", { email, otp });
//       return response.data;
//     } catch (error) {
//       console.error("Verify OTP error:", error.response?.data || error.message);
//       throw error;
//     }
//   },

//   resetPassword: async ({ token, password, password_confirmation }) => {
//     await ensureCsrfToken();
//     try {
//       const response = await apiClient.post("/reset-password", {
//         token,
//         password,
//         password_confirmation,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Reset password error:", error.response?.data || error.message);
//       throw error;
//     }
//   },
// };

// export default apiClient;

// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper to get CSRF token and set it in axios headers
const ensureCsrfToken = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });
    apiClient.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
    console.log("CSRF token fetched successfully:", data.csrf_token);
    return data.csrf_token;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

// Response Interceptor: Handle 401 and 419 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (
        error.response.status === 401 &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/reset-password") &&
        !window.location.pathname.includes("/reset-password-otp")
      ) {
        console.warn("Unauthorized, redirecting to login...");
        window.location.href = "/login";
      } else if (error.response.status === 419) {
        console.error("CSRF token mismatch:", {
          url: error.config.url,
          data: error.config.data,
          headers: error.config.headers,
        });
        try {
          await ensureCsrfToken();
          console.log("Retrying request with new CSRF token...");
          return apiClient(error.config); // Retry the failed request
        } catch (retryError) {
          console.error(
            "Retry failed:",
            retryError.response?.data || retryError.message
          );
          throw retryError;
        }
      }
    }
    throw error;
  }
);

export const authService = {
  login: async (credentials) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  register: async (userData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/register", userData);
      return response.data;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  activate: async (token) => {
    try {
      const response = await apiClient.get(`/activate/${token}`);
      return response.data;
    } catch (error) {
      console.error("Activation error:", error.response?.data || error.message);
      throw error;
    }
  },

  resendVerification: async (email) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/resend-verification", { email });
      return response.data;
    } catch (error) {
      console.error(
        "Resend verification error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/user");
      return response.data;
    } catch (error) {
      console.error(
        "Get current user error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  logout: async () => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/logout");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      throw error;
    }
  },

  requestPasswordReset: async ({ email, method }) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/request-password-reset", {
        email,
        method,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Request password reset error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  verifyOtp: async ({ email, otp }) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      console.error("Verify OTP error:", error.response?.data || error.message);
      throw error;
    }
  },

  resetPassword: async ({ token, password, password_confirmation }) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.post("/reset-password", {
        token,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateProfile: async (userData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.put("/user", {
        name: userData.name,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updatePassword: async (passwordData) => {
    await ensureCsrfToken();
    try {
      const response = await apiClient.put("/user/password", {
        current_password: passwordData.current_password,
        password: passwordData.password,
        password_confirmation: passwordData.password_confirmation,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Update password error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  updateAvatar: async (file) => {
    await ensureCsrfToken();
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await apiClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Update avatar error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

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
};

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

export default apiClient;
