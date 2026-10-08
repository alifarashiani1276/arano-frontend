import { NavLink, useNavigate } from "react-router-dom";
import { FiGlobe, FiLogOut } from "react-icons/fi";
import { site } from "../../config/site";
import { getSessionArea, useSession } from "../auth/session";
import { logout } from "../../services/authService";

const linkClass = ({ isActive }) =>
  isActive ? "dashboard-nav-item is-active" : "dashboard-nav-item";

export default function Sidebar({ items, open }) {
  const navigate = useNavigate();
  const user = useSession();

  const handleLogout = async () => {
    // قبل از خروج مشخص می‌کنیم بعدش به کدام صفحه‌ی ورود برگردیم
    const loginPath =
      getSessionArea(user) === "admin" ? "/auth/admin" : "/auth/login";

    try {
      await logout();
    } finally {
      navigate(loginPath, { replace: true });
    }
  };

  return (
    <aside
      className="dashboard-sidebar"
      data-open={open}
      id="dashboard-sidebar"
    >
      <div className="dashboard-brand">
        <img src={site.logo.src} alt="" />
        <span>{site.name}</span>
      </div>

      <nav className="dashboard-nav" aria-label="منوی داشبورد">
        {items.map(({ to, label, icon: IconComp, end, superOnly }, index) => (
          <div key={to}>
            {superOnly &&
              index === items.findIndex((item) => item.superOnly) && (
                <p className="dashboard-nav-label">مدیریت ارشد</p>
              )}
            <NavLink to={to} end={end} className={linkClass}>
              <IconComp size={18} aria-hidden="true" />
              {label}
            </NavLink>
          </div>
        ))}
      </nav>

      <div className="dashboard-sidebar-foot">
        <NavLink to="/" className="dashboard-nav-item">
          <FiGlobe size={18} aria-hidden="true" />
          صفحه اصلی
        </NavLink>

        <button
          type="button"
          className="dashboard-nav-item w-full"
          onClick={handleLogout}
        >
          <FiLogOut size={18} aria-hidden="true" />
          خروج
        </button>
      </div>
    </aside>
  );
}
