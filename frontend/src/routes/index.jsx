// index.jsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import NoteDetail from "../pages/NoteDetail";
import SharedNotes from "../pages/SharedNotes";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import PasswordReset from "../pages/PasswordReset";
import PasswordResetOtp from "../pages/PasswordResetOtp";
import ForgotPassword from "../pages/ForgotPassword";
import TestColor from "../pages/TestColor";
import VerificationSuccess from "../pages/VerificationSucess";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children, allowAuthenticated = false }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated || allowAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/note/:id",
        element: (
          <ProtectedRoute>
            <NoteDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/shared",
        element: (
          <ProtectedRoute>
            <SharedNotes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/test-color",
        element: (
          <ProtectedRoute>
            <TestColor />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password/:token",
    element: (
      <PublicRoute>
        <PasswordReset />
      </PublicRoute>
    ),
  },
  {
    path: "/reset-password-otp",
    element: (
      <PublicRoute>
        <PasswordResetOtp />
      </PublicRoute>
    ),
  },
  {
    path: "/verification-success",
    element: (
      <PublicRoute allowAuthenticated={true}>
        <VerificationSuccess />
      </PublicRoute>
    ),
  },
]);

export default router;
