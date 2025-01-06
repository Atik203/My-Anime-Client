import ProtectedRoute from "@/components/layout/ProtectedRoute";
import AddedAnime from "@/pages/AddedAnime";
import AddedAnimeDetails from "@/pages/AddedAnimeDetails.";
import Bookmark from "@/pages/Bookmark";
import Home from "@/pages/Home";
import Popular from "@/pages/Popular";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Setting from "@/pages/Setting";
import Upcoming from "@/pages/Upcoming";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "./../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1>Not Found</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "added-anime",
        element: (
          <ProtectedRoute role={["admin", "normal", "superAdmin"]}>
            <AddedAnime />
          </ProtectedRoute>
        ),
      },
      {
        path: "upcoming",
        element: <Upcoming />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute role={["admin", "normal", "superAdmin"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookmarks",
        element: (
          <ProtectedRoute role={["admin", "normal", "superAdmin"]}>
            <Bookmark />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute role={["admin", "normal", "superAdmin"]}>
            <Setting />
          </ProtectedRoute>
        ),
      },
      {
        path: "added-anime/:year/:month/:day/:slug",
        element: <AddedAnimeDetails />,
      },
    ],
  },
]);

export default router;
