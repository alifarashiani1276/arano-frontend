import { formatNumber } from "../../data/dashboard";

export default function StatCard({ icon: IconComp, label, value }) {
  return (
    <div className="dashboard-stat">
      <span className="dashboard-stat-icon">
        <IconComp size={20} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="dashboard-stat-value">{formatNumber(value)}</p>
        <p className="dashboard-stat-label">{label}</p>
      </div>
    </div>
  );
}
