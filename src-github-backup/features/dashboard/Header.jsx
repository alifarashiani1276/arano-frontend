import { FiMenu } from "react-icons/fi";
import ThemeSwitcher from "../home/ThemeSwitcher";
import { ROLE_LABELS } from "../../data/dashboard";

export default function Header({ profile, onMenu, menuOpen }) {
  const first = profile.first_name?.[0] ?? "آ";
  const last = profile.last_name?.[0] ?? "";
  const initials = `${first}${last}`;

  return (
    <header className="dashboard-topbar">
      <button
        type="button"
        className="dashboard-icon-button dashboard-menu-button"
        aria-label="باز کردن منو"
        aria-expanded={menuOpen}
        aria-controls="dashboard-sidebar"
        onClick={onMenu}
      >
        <FiMenu size={20} aria-hidden="true" />
      </button>

      <div className="dashboard-topbar-actions">
        <ThemeSwitcher />
        <div className="dashboard-user-chip">
          <span className="dashboard-avatar">{initials}</span>
          <span className="dashboard-user-name">
            {profile.first_name || "کاربر"} {profile.last_name}
          </span>
          <span className="dashboard-hint hidden md:block">
            {ROLE_LABELS[profile.role] ?? profile.role}
          </span>
        </div>
      </div>
    </header>
  );
}
