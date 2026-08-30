import { createBrowserRouter, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import FindServicePage from "../pages/FindServicePage.jsx";
import FindJobsPage from "../pages/FindJobsPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import SectionPage from "../pages/SectionPage.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AccountActionPage from "../pages/AccountActionPage.jsx";
import NidVerificationPage from "../pages/NidVerificationPage.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import PostJobPage from "../pages/PostJobPage.jsx";

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

  {
    element: <ProtectedRoute />,
    children: [
      { path: "verify-nid", element: <NidVerificationPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "post-job", element: <PostJobPage /> },
      {
        path: "dashboard",
        element: (
          <div className="mx-auto max-w-5xl px-5 py-16">
            <h1 className="text-3xl font-bold text-[#011F50]">
              Your dashboard
            </h1>
            <p className="mt-3 text-slate-600">
              Manage your profile, jobs, proposals, and conversations.
            </p>
            <Link
              className="mt-6 inline-block font-semibold text-[#0066FF]"
              to="/verify-nid"
            >
              Verify your NID
            </Link>
          </div>
        ),
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "forgot-password", element: <AccountActionPage /> },
      { path: "reset-password/:token", element: <AccountActionPage /> },
      { path: "verify-email/:token", element: <AccountActionPage /> },
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
