import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
import ChatPage from "../pages/ChatPage.jsx";
import HirerDashboardPage from "../pages/HirerDashboardPage.jsx";
import ProviderDashboardPage from "../pages/ProviderDashboardPage.jsx";
import PaymentSuccessPage from "../pages/PaymentSuccessPage.jsx";
import PaymentFailedPage from "../pages/PaymentFailedPage.jsx";
import WalletPage from "../pages/WalletPage.jsx";

// Admin Panel Imports
import { AdminRoute } from "../components/admin/AdminRoute.jsx";
import { AdminProvider } from "../contexts/AdminContext.jsx";
import { AdminLayout } from "../components/admin/AdminLayout.jsx";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage.jsx";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage.jsx";
import { AdminVerificationsPage } from "../pages/admin/AdminVerificationsPage.jsx";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage.jsx";
import { AdminJobsPage } from "../pages/admin/AdminJobsPage.jsx";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage.jsx";
import { AdminDisputesPage } from "../pages/admin/AdminDisputesPage.jsx";
import { AdminManagersPage } from "../pages/admin/AdminManagersPage.jsx";
import { AdminAuditLogsPage } from "../pages/admin/AdminAuditLogsPage.jsx";

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
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "services",
            element: <FindServicePage />,
          },
          {
            path: "jobs",
            element: <FindJobsPage />,
          },
          { path: "verify-nid", element: <NidVerificationPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "post-job", element: <PostJobPage /> },
          { path: "hirer/jobs", element: <HirerDashboardPage /> },
          {
            path: "hirer/jobs/:jobId/applicants",
            element: <HirerDashboardPage />,
          },
          { path: "provider/jobs", element: <ProviderDashboardPage /> },
          { path: "chat", element: <ChatPage /> },
          { path: "chat/:jobId/:proposalId", element: <ChatPage /> },
          {
            path: "dashboard",
            element: <HirerDashboardPage />,
          },
          { path: "payment/success", element: <PaymentSuccessPage /> },
          { path: "payment/failed", element: <PaymentFailedPage /> },
          { path: "wallet", element: <WalletPage /> },
        ],
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

  // Admin Panel Auth & Protected Dashboard Tree
  {
    element: (
      <AdminProvider>
        <Outlet />
      </AdminProvider>
    ),
    children: [
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
              },
              { path: "dashboard", element: <AdminOverviewPage /> },
              {
                element: <AdminRoute requiredPermission="canVerifyNID" />,
                children: [
                  {
                    path: "verifications",
                    element: <AdminVerificationsPage />,
                  },
                ],
              },
              {
                element: <AdminRoute requiredPermission="canManageUsers" />,
                children: [{ path: "users", element: <AdminUsersPage /> }],
              },
              {
                element: <AdminRoute requiredPermission="canManageJobs" />,
                children: [{ path: "jobs", element: <AdminJobsPage /> }],
              },
              {
                element: <AdminRoute requiredPermission="canModerateContent" />,
                children: [
                  { path: "categories", element: <AdminCategoriesPage /> },
                ],
              },
              {
                element: <AdminRoute requiredPermission="canHandleDisputes" />,
                children: [
                  { path: "disputes", element: <AdminDisputesPage /> },
                ],
              },
              {
                element: <AdminRoute superAdminOnly={true} />,
                children: [
                  { path: "managers", element: <AdminManagersPage /> },
                  { path: "audit-logs", element: <AdminAuditLogsPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
