  // import { createBrowserRouter } from "react-router-dom";
  // import AppLayout from "../layout/AppLayout";
  // import Home from "../pages/Home";
  // import Login from "../pages/Login";
  // import Register from "../pages/Register";
  // import Profile from "../pages/Profile";
  // import NoteDetail from "../pages/NoteDetail";
  // import SharedNotes from "../pages/SharedNotes";

  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <AppLayout />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Home />,
  //       },
  //       {
  //         path: "/note/:id",
  //         element: <NoteDetail />,
  //       },
  //       {
  //         path: "/shared",
  //         element: <SharedNotes />,
  //       },
  //       {
  //         path: "/profile/:id",
  //         element: <Profile />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/login",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/register",
  //     element: <Register />,
  //   },
  // ]);

  // export default router;


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

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Public Route Component (for login/register)
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
  ]);

  export default router;