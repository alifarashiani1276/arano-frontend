import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../auth/session";

export default function SuperOnlyRoute() {
  const user = useSession();

  return user?.role === "SUPER_ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" replace />
  );
}
