import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileCommunityPage from "./pages/MobileCommunityPage";
import UsersPosts from "./pages/UsersPosts";
import { Toaster } from "sonner";

// 1. Define the router configuration outside the component
const router = createBrowserRouter([
  {
    // Auth pages — no sidebar/shell
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    // App shell with sidebar (Layout route)
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "post/:id",
        element: <PostDetailPage />,
      },
      {
        path: "userposts/:id",
        element: <UsersPosts />,
      },
      {
        path: "communities",
        element: <MobileCommunityPage />,
      },
      {
        path: "community/:id",
        element: <CommunityPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    // 404 Catch-all
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" duration={1000} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
