import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import FindServicePage from "../pages/FindServicePage.jsx";
import FindJobsPage from "../pages/FindJobsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import SectionPage from "../pages/SectionPage.jsx";
import AuthPage from "../pages/AuthPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "services",
        element: <FindServicePage />,
      },
      {
        path: "jobs",
        element: <FindJobsPage />,
      },
      {
        path: "how-it-works",
        element: (
          <SectionPage
            title="How It Works"
            description="See how Nirbhor connects verified users through jobs, proposals, chat, and secure payment."
          />
        ),
      },
      {
        path: "about",
        element: (
          <SectionPage
            title="About Nirbhor"
            description="Learn how Nirbhor is built to support trust, verification, and professional service hiring."
          />
        ),
      },
      {
        path: "faq",
        element: (
          <SectionPage
            title="FAQ"
            description="Find answers to common questions about verification, jobs, proposals, and payments."
          />
        ),
      },
      {
        path: "privacy",
        element: (
          <SectionPage
            title="Privacy Policy"
            description="Review how Nirbhor protects account data, verification details, and job-related information."
          />
        ),
      },
      {
        path: "terms",
        element: (
          <SectionPage
            title="Terms & Conditions"
            description="Read the platform rules that guide account use, verification, and marketplace activity."
          />
        ),
      },
    ],
  },

  // Auth routes — separate layout (no Header/Footer)
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <AuthPage />,
      },
      {
        path: "register",
        element: <AuthPage />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
