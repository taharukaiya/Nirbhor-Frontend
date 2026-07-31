import { Navigate, Route, Routes } from "react-router-dom";
import {
  AdminLayout,
  AuthLayout,
  DashboardLayout,
  PublicLayout,
} from "./layouts/AppLayouts.jsx";
import {
  AboutPage,
  AdminAnalyticsPage,
  AdminDashboardPage,
  AdminDisputesPage,
  AdminJobsPage,
  AdminSettingsPage,
  AdminUsersPage,
  AdminVerificationsPage,
  ContactPage,
  CreateJobPage,
  DashboardHomePage,
  DisputePage,
  ForgotPasswordPage,
  HomePage,
  JobChatPage,
  JobDetailsPage,
  JobsPage,
  LoginPage,
  MyJobsPage,
  NotificationsPage,
  NotFoundPage,
  PaymentPage,
  ProfilePage,
  ProviderProfilePage,
  ProvidersPage,
  RegisterPage,
  ReviewsPage,
  ServicesPage,
} from "./pages/AppPages.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="providers" element={<ProvidersPage />} />
        <Route path="providers/:id" element={<ProviderProfilePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="how-it-works" element={<AboutPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route
          path="dashboard"
          element={<Navigate to="/dashboard/hirer" replace />}
        />
        <Route
          path="dashboard/hirer"
          element={<DashboardHomePage role="hirer" />}
        />
        <Route
          path="dashboard/provider"
          element={<DashboardHomePage role="provider" />}
        />
        <Route path="dashboard/jobs/create" element={<CreateJobPage />} />
        <Route path="dashboard/jobs" element={<MyJobsPage />} />
        <Route path="dashboard/chat/:jobId" element={<JobChatPage />} />
        <Route path="dashboard/payments" element={<PaymentPage />} />
        <Route path="dashboard/profile" element={<ProfilePage />} />
        <Route path="dashboard/notifications" element={<NotificationsPage />} />
        <Route path="dashboard/reviews" element={<ReviewsPage />} />
        <Route path="dashboard/disputes/:jobId" element={<DisputePage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route
          path="admin/verifications"
          element={<AdminVerificationsPage />}
        />
        <Route path="admin/jobs" element={<AdminJobsPage />} />
        <Route path="admin/disputes" element={<AdminDisputesPage />} />
        <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
        <Route path="admin/settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
