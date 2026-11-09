import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ADMIN_NAV, USER_NAV } from "./nav";
import { useSession } from "../auth/session";

export default function DashboardLayout({ area }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const user = useSession();
  const isAdmin = area === "admin";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!user) {
    return null;
  }

  const items = isAdmin
    ? ADMIN_NAV.filter((item) => !item.superOnly || user.role === "SUPER_ADMIN")
    : USER_NAV;

  return (
    <div dir="rtl" className="dashboard-shell">
      <Sidebar items={items} open={open} />
      {open && (
        <div
          className="dashboard-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="dashboard-main">
        <Header
          profile={user}
          menuOpen={open}
          onMenu={() => setOpen((value) => !value)}
        />

        <main className="dashboard-content">
          <Suspense
            fallback={<p className="dashboard-hint">در حال بارگذاری…</p>}
          >
            <Outlet context={{ role: user.role, user }} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
