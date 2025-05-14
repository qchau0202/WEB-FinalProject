import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { authService } from "../services/api";

const defaultAuthContextValue = {
  currentUser: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
};

const AuthContext = createContext(defaultAuthContextValue);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pollingRef = useRef(null);

  // Fetch user info from backend
  const fetchUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for verification status if not verified
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUser && !currentUser.email_verified_at) {
      // Start polling every 5 seconds
      pollingRef.current = setInterval(() => {
        fetchUser();
      }, 5000);
    } else if (pollingRef.current) {
      // Stop polling if verified
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [currentUser]);

  const login = async (credentials) => {
    try {
      await authService.login(credentials);
      await fetchUser();
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
      await fetchUser();
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      setCurrentUser(null);
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await authService.resendVerification(email);
      await fetchUser();
      return response;
    } catch (error) {
      console.error(
        "Resend verification error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isVerified: currentUser ? !!currentUser.email_verified_at : false,
    resendVerification,
    fetchUser, // expose for manual refresh if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
