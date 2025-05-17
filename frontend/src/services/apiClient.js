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
// export const ensureCsrfToken = async () => {
//   try {
//     const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, {
//       withCredentials: true,
//     });
//     apiClient.defaults.headers.common["X-CSRF-TOKEN"] = data.csrf_token;
//     // console.log("CSRF token fetched successfully:", data.csrf_token);
//     return data.csrf_token;
//   } catch (error) {
//     console.error("Failed to fetch CSRF token:", {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message,
//     });
//     throw error;
//   }
// };

// // Response Interceptor: Handle 401 and 419 errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response) {
//       if (
//         error.response.status === 401 &&
//         !window.location.pathname.includes("/login") &&
//         !window.location.pathname.includes("/reset-password") &&
//         !window.location.pathname.includes("/reset-password-otp")
//       ) {
//         console.warn("Unauthorized, redirecting to login...");
//         window.location.href = "/login";
//       } else if (error.response.status === 419) {
//         console.error("CSRF token mismatch:", {
//           url: error.config.url,
//           data: error.config.data,
//           headers: error.config.headers,
//         });
//         try {
//           await ensureCsrfToken();
//           console.log("Retrying request with new CSRF token...");
//           return apiClient(error.config); // Retry the failed request
//         } catch (retryError) {
//           console.error(
//             "Retry failed:",
//             retryError.response?.data || retryError.message
//           );
//           throw retryError;
//         }
//       }
//     }
//     throw error;
//   }
// );

// export default apiClient;

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

// CSRF token cache
let cachedCsrfToken = null;

// Helper to clear CSRF token
export const clearCsrfToken = () => {
  cachedCsrfToken = null;
  delete apiClient.defaults.headers.common["X-CSRF-TOKEN"];
};

// Helper to get CSRF token and set it in axios headers
export const ensureCsrfToken = async () => {
  if (cachedCsrfToken) {
    apiClient.defaults.headers.common["X-CSRF-TOKEN"] = cachedCsrfToken;
    return cachedCsrfToken;
  }
  try {
    const { data } = await axios.get(`${API_BASE_URL}/csrf-token`, {
      withCredentials: true,
    });
    cachedCsrfToken = data.csrf_token;
    apiClient.defaults.headers.common["X-CSRF-TOKEN"] = cachedCsrfToken;
    return cachedCsrfToken;
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
          // Clear cached token and fetch a new one
          cachedCsrfToken = null;
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

export default apiClient;
