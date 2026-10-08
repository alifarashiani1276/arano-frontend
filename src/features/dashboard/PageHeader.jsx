export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="dashboard-page-header">
      <div className="min-w-0">
        <h1 className="dashboard-title">{title}</h1>
        {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="dashboard-actions">{children}</div>}
    </div>
  );
}
