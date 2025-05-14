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
  const { data } = await apiClient.get("/csrf-token");
  apiClient.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
};

// Response Interceptor: Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
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
    const response = await apiClient.get("/user");
    return response.data;
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
};

export default apiClient;
