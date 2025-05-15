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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
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
]);

export default router;

// import { createBrowserRouter, Navigate } from "react-router-dom";
// import AppLayout from "../layout/AppLayout";
// import Home from "../pages/Home";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Profile from "../pages/Profile";
// import NoteDetail from "../pages/NoteDetail";
// import SharedNotes from "../pages/SharedNotes";
// import PasswordReset from "../pages/PasswordReset";
// import PasswordResetOtp from "../pages/PasswordResetOtp";
// import { useAuth } from "../contexts/AuthContext";
// import { ConfigProvider } from "antd";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "../contexts/AuthContext";
// import { LabelsProvider } from "../contexts/LabelsContext";
// import { NotesProvider } from "../contexts/NotesContext";
// import { useNavigate } from "react-router-dom";

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   if (isLoading) return null; // Wait for auth state to resolve
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// // Public Only Route Component (for login/register)
// const PublicOnlyRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   if (isLoading) return null; // Wait for auth state to resolve
//   return !isAuthenticated ? children : <Navigate to="/" replace />;
// };

// // Root component with providers
// const Root = () => {
//   const navigate = useNavigate();

//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           fontFamily: "Lexend",
//         },
//       }}
//     >
//       <AuthProvider>
//         <LabelsProvider>
//           <NotesProvider navigate={navigate}>
//             <AppLayout />
//             <Toaster
//               position="top-right"
//               toastOptions={{
//                 duration: 3000,
//                 style: {
//                   background: "#363636",
//                   color: "#fff",
//                 },
//                 success: {
//                   duration: 2000,
//                   theme: {
//                     primary: "#4aed88",
//                   },
//                 },
//                 error: {
//                   duration: 2000,
//                   theme: {
//                     primary: "#ff4b4b",
//                   },
//                 },
//               }}
//             />
//           </NotesProvider>
//         </LabelsProvider>
//       </AuthProvider>
//     </ConfigProvider>
//   );
// };

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     children: [
//       {
//         index: true,
//         element: (
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/note/:id",
//         element: (
//           <ProtectedRoute>
//             <NoteDetail />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/shared",
//         element: (
//           <ProtectedRoute>
//             <SharedNotes />
//           </ProtectedRoute>
//         ),
//       },
//       {
//         path: "/profile/:id",
//         element: (
//           <ProtectedRoute>
//             <Profile />
//           </ProtectedRoute>
//         ),
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: (
//       <PublicOnlyRoute>
//         <Login />
//       </PublicOnlyRoute>
//     ),
//   },
//   {
//     path: "/register",
//     element: (
//       <PublicOnlyRoute>
//         <Register />
//       </PublicOnlyRoute>
//     ),
//   },
//   {
//     path: "/reset-password/:token",
//     element: <PasswordReset />, // Accessible to all
//   },
//   {
//     path: "/reset-password-otp",
//     element: <PasswordResetOtp />, // Accessible to all
//   },
//   // Redirect any unknown route to home or login
//   {
//     path: "*",
//     element: <Navigate to="/" replace />,
//   },
// ]);

// export default router;
