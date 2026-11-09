import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiLoader,
  FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import { getUserHistory } from "../../../services/dashboardService";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatCard from "../../../features/dashboard/StatCard";
import DataTable from "../../../features/dashboard/DataTable";
import StatusBadge from "../../../features/dashboard/StatusBadge";
import { formatMoney } from "../../../data/dashboard";

export default function UserHistory() {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    getUserHistory()
      .then(setHistory)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const summary = history?.summary ?? {};

  const columns = [
    {
      key: "title",
      header: "پروژه",
      render: (project) => (
        <>
          <span className="dashboard-cell-main">{project.title}</span>
          <span className="dashboard-cell-sub">
            {project.category?.name ?? "—"}
          </span>
        </>
      ),
    },
    {
      key: "budget",
      header: "بودجه",
      render: (project) => formatMoney(project.budget),
    },
    {
      key: "deadline",
      header: "مهلت",
      render: (project) =>
        new Date(project.deadline).toLocaleDateString("fa-IR"),
    },
    {
      key: "status",
      header: "وضعیت",
      render: (project) => (
        <StatusBadge kind="project" value={project.status} />
      ),
    },
  ];

  return (
    <>
      <PageHeader title="تاریخچه" subtitle="خلاصه و سابقه پروژه‌های حساب شما" />

      {!history ? (
        <p className="dashboard-hint">در حال دریافت تاریخچه…</p>
      ) : (
        <>
          <div className="dashboard-grid-stats">
            <StatCard
              icon={FiFolder}
              label="کل پروژه‌ها"
              value={summary.total_projects ?? 0}
            />
            <StatCard
              icon={FiClock}
              label="در انتظار"
              value={summary.pending_projects ?? 0}
            />
            <StatCard
              icon={FiLoader}
              label="در حال انجام"
              value={summary.active_projects ?? 0}
            />
            <StatCard
              icon={FiCheckCircle}
              label="تکمیل‌شده"
              value={summary.completed_projects ?? 0}
            />
            <StatCard
              icon={FiXCircle}
              label="لغوشده"
              value={summary.cancelled_projects ?? 0}
            />
          </div>

          <section className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2 className="dashboard-panel-title">سابقه پروژه‌ها</h2>
            </div>
            <DataTable
              columns={columns}
              rows={history.projects ?? []}
              empty={{ title: "سابقه‌ای برای نمایش وجود ندارد" }}
            />
          </section>
        </>
      )}
    </>
  );
}
