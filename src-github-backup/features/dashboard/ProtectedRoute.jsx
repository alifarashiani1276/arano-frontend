import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSession } from "../auth/session";
import { tokenStore } from "../auth/token";

export default function ProtectedRoute({ area }) {
  const user = useSession();
  const location = useLocation();
  const hasToken = Boolean(tokenStore.get());

  // مدیر به صفحه‌ی ورود مدیر می‌رود، کاربر عادی به ورود کاربران
  const loginPath = area === "admin" ? "/auth/admin" : "/auth/login";

  if (!hasToken) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (!user) {
    return (
      <div dir="rtl" className="dashboard-shell">
        <main className="dashboard-content">
          <p className="dashboard-hint">در حال بررسی نشست کاربری…</p>
        </main>
      </div>
    );
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  if (area === "admin" && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (area === "user" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (area === "user") {
    if (!user.profile_completed) {
      return <Navigate to="/auth/complete-profile" replace />;
    }

    if (user.status !== "APPROVED") {
      return <Navigate to="/auth/pending" replace />;
    }

    if (user.is_active === false) {
      return <Navigate to={loginPath} replace />;
    }
  }

  if (area === "admin") {
    if (user.status !== "APPROVED" || user.is_active === false) {
      return <Navigate to={loginPath} replace />;
    }
  }

  return <Outlet />;
}
