import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import SectionPage from "../pages/SectionPage.jsx";

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
        element: (
          <SectionPage
            title="Find Services"
            description="Browse verified Service Providers and choose the right expert for the job."
          />
        ),
      },
      {
        path: "jobs",
        element: (
          <SectionPage
            title="Find Jobs"
            description="Explore open jobs posted by verified Hirers across different service categories."
          />
        ),
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
        path: "contact",
        element: (
          <SectionPage
            title="Contact"
            description="Get in touch with the Nirbhor team for support, questions, or platform feedback."
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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
