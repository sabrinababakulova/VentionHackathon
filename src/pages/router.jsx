import { ScrollRestoration } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import Home from "./Home";
import NotFound from "./NotFound";
import HowTo from "./HowTo";
import ProjectDescription from "./ProjectDescription";
import Ideas from "./Ideas";
import ProjectLayout from "./ProjectLayout";
import SignIn from "./SignIn";
import Docs from "./Docs";

export const router = () =>
  createBrowserRouter([
        {
          path: "/sign-in",
          element: <SignIn />,
        },
    {
      element: (
        <>
          <ScrollRestoration getKey={(location) => location.pathname} />
          <Layout />
        </>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/projects/:id",
          element: <ProjectLayout />,
          children: [
            {
              index: true,
              element: <ProjectDescription />,
            },
            {
              path: "/projects/:id/ideas",
              element: <Ideas />,
            },
            {
              path: "/projects/:id/docs",
              element: <Docs />,
            },
            {
              path: "/projects/:id/pdw",
              element: <Docs />,
            },
          ],
        },
        {
          path: "/how-to",
          element: <HowTo />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
