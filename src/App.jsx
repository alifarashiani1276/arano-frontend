import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import VerifyOtp from "./pages/VerifyOtp";
import CompleteProfile from "./pages/CompleteProfile";
import AuthPending from "./pages/AuthPending";

import RequireStep from "./features/auth/RequireStep";
import AuthBootstrap from "./features/auth/AuthBootstrap";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import ProtectedRoute from "./features/dashboard/ProtectedRoute";
import SuperOnlyRoute from "./features/dashboard/SuperOnlyRoute";

const UserOverview = lazy(() => import("./pages/dashboard/user/Overview"));
const UserProjects = lazy(() => import("./pages/dashboard/user/Projects"));
const UserHistory = lazy(() => import("./pages/dashboard/user/History"));
const UserSupport = lazy(() => import("./pages/dashboard/user/Support"));
const UserProfile = lazy(() => import("./pages/dashboard/user/Profile"));

const AdminOverview = lazy(() => import("./pages/dashboard/admin/Overview"));
const AdminRequests = lazy(() => import("./pages/dashboard/admin/Requests"));
const AdminUsers = lazy(() => import("./pages/dashboard/admin/Users"));
const AdminProjects = lazy(() => import("./pages/dashboard/admin/Projects"));
const AdminSupport = lazy(() => import("./pages/dashboard/admin/Support"));
const AdminHistory = lazy(() => import("./pages/dashboard/admin/History"));
const AdminConsultations = lazy(
  () => import("./pages/dashboard/admin/Consultations"),
);
const Admins = lazy(() => import("./pages/dashboard/admin/Admins"));
const Roles = lazy(() => import("./pages/dashboard/admin/Roles"));
const AdminProfile = lazy(() => import("./pages/dashboard/admin/Profile"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

      <Route
        path="/auth/otp"
        element={
          <RequireStep step="phone">
            <VerifyOtp />
          </RequireStep>
        }
      />

      <Route
        path="/auth/complete-profile"
        element={
          <RequireStep step="verified">
            <CompleteProfile />
          </RequireStep>
        }
      />

      <Route path="/auth/pending" element={<AuthPending />} />

      <Route element={<ProtectedRoute area="user" />}>
        <Route path="/dashboard" element={<DashboardLayout area="user" />}>
          <Route index element={<UserOverview />} />
          <Route path="projects" element={<UserProjects />} />
          <Route path="history" element={<UserHistory />} />
          <Route path="support" element={<UserSupport />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute area="admin" />}>
        <Route path="/admin" element={<DashboardLayout area="admin" />}>
          <Route index element={<AdminOverview />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="consultations" element={<AdminConsultations />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route element={<SuperOnlyRoute />}>
            <Route path="admins" element={<Admins />} />
            <Route path="roles" element={<Roles />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}

      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            "!bg-surface !text-foreground !border !border-border !text-sm",
        }}
      />

      <AuthBootstrap>
        <AppRoutes />
      </AuthBootstrap>
    </QueryClientProvider>
  );
}

export default App;
