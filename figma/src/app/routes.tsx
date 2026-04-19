import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/pages/Home";
import Predictions from "./components/pages/Predictions";
import Events from "./components/pages/Events";
import Leaderboard from "./components/pages/Leaderboard";
import Profile from "./components/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "pronos", Component: Predictions },
      { path: "evenements", Component: Events },
      { path: "ligue", Component: Leaderboard },
      { path: "profil", Component: Profile },
    ],
  },
]);
