import { Layout } from "../components/Layout";
import VJAbout from "../pages/VJAbout";
import VJContact from "../pages/VJContact";
import VJHome from "../pages/vjHome";
import VJProjectDetails from "../pages/VJProjectDetails";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <VJHome /> },
      { path: "/project-details/:id", element: <VJProjectDetails /> },
      { path: "/about", element: <VJAbout /> },
      { path: "/contact", element: <VJContact /> },
    ],
  },
]);
