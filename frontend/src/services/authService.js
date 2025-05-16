import apiClient, { ensureCsrfToken } from "./apiClient";

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

export default authService;
