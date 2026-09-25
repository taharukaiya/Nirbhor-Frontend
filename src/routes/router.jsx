/**
 * Application Router Definition
 * 
 * Architectural Intent:
 * The single source of truth for all client-side routing, utilizing React Router v6's 
 * Data Router pattern (`createBrowserRouter`).
 * 
 * Hierarchy:
 * 1. `MainLayout`: Public pages and standard authenticated dashboards (`/`).
 * 2. `AuthLayout`: Chromeless authentication flows (`/login`, `/register`).
 * 3. `AdminProvider` & `AdminLayout`: The dedicated, RBAC-protected management console (`/admin`).
 */
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
import TransactionDashboardPage from "../pages/TransactionDashboardPage.jsx";
import PublicProfilePage from "../pages/PublicProfilePage.jsx";

// Admin Panel Imports
import { AdminRoute } from "./AdminRoute.jsx";
import { AdminProvider } from "../contexts/AdminContext.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage.jsx";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage.jsx";
import { AdminVerificationsPage } from "../pages/admin/AdminVerificationsPage.jsx";
import { AdminUsersPage } from "../pages/admin/AdminUsersPage.jsx";
import { AdminJobsPage } from "../pages/admin/AdminJobsPage.jsx";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage.jsx";
import { AdminDisputesPage } from "../pages/admin/AdminDisputesPage.jsx";
import { AdminManagersPage } from "../pages/admin/AdminManagersPage.jsx";
import { AdminAuditLogsPage } from "../pages/admin/AdminAuditLogsPage.jsx";
import AdminReportsPage from "../pages/admin/AdminReportsPage.jsx";
import AdminAccountActionPage from "../pages/admin/AdminAccountActionPage.jsx";
import { AdminMessageReportsPage } from "../pages/admin/AdminMessageReportsPage.jsx";

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
            titleKey="howItWorks.pageTitle"
            descKey="howItWorks.pageDescription"
          />
        ),
      },
      {
        path: "about",
        element: (
          <SectionPage
            titleKey="about.pageTitle"
            descKey="about.pageDescription"
          />
        ),
      },
      {
        path: "faq",
        element: (
          <SectionPage
            titleKey="faq.pageTitle"
            descKey="faq.pageDescription"
          />
        ),
      },
      {
        path: "privacy",
        element: (
          <SectionPage
            titleKey="privacy.pageTitle"
            descKey="privacy.pageDescription"
          />
        ),
      },
      {
        path: "terms",
        element: (
          <SectionPage
            titleKey="terms.pageTitle"
            descKey="terms.pageDescription"
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
          { path: "user/:id", element: <PublicProfilePage /> },
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
          { path: "transactions", element: <TransactionDashboardPage /> },
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
        path: "admin/forgot-password",
        element: <AdminAccountActionPage />,
      },
      {
        path: "admin/reset-password/:token",
        element: <AdminAccountActionPage />,
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
                  { path: "message-reports", element: <AdminMessageReportsPage /> },
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
                  { path: "reports", element: <AdminReportsPage /> },
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
