import Ongoing from "@/pages/Ongoing";
import Popular from "@/pages/Popular";
import Register from "@/pages/Register";
import Upcoming from "@/pages/Upcoming";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "./../pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "ongoing",
        element: <Ongoing />,
      },
      {
        path: "upcoming",
        element: <Upcoming />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default router;
