import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock, FiFolder, FiLoader } from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  getUserDashboard,
  getUserProjects,
  getUserHistory,
} from "../../../services/dashboardService";
import DataTable from "../../../features/dashboard/DataTable";
import EmptyState from "../../../features/dashboard/EmptyState";
import HistoryList from "../../../features/dashboard/HistoryList";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatCard from "../../../features/dashboard/StatCard";
import StatusBadge from "../../../features/dashboard/StatusBadge";
import { formatMoney } from "../../../data/dashboard";
import { useSession } from "../../../features/auth/session";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fa-IR");
};

export default function UserOverview() {
  const user = useSession();
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([getUserDashboard(), getUserProjects(), getUserHistory()])
      .then(([dashboardData, projectData, historyData]) => {
        if (!active) return;
        setDashboard(dashboardData);
        setProjects(projectData);
        setHistory(historyData.projects ?? []);
      })
      .catch((error) => {
        if (active) toast.error(apiMessage(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats ?? {};
  const recentProjects = projects.slice(0, 3);

  const columns = [
    {
      key: "title",
      header: "پروژه",
      render: (project) => (
        <>
          <span className="dashboard-cell-main">{project.title}</span>
          <span className="dashboard-cell-sub">
            {project.category?.name ?? "بدون دسته‌بندی"}
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
      key: "status",
      header: "وضعیت",
      render: (project) => (
        <StatusBadge kind="project" value={project.status} />
      ),
    },
  ];

  const historyItems = history.slice(0, 4).map((project) => ({
    id: `project-${project.id}`,
    icon: "project",
    text: `پروژه «${project.title}» در وضعیت «${project.status}» قرار دارد.`,
    time: formatDate(project.updated_at ?? project.created_at),
  }));

  return (
    <>
      <PageHeader
        title={`سلام ${user?.first_name || ""}!`}
        subtitle="خلاصه‌ی وضعیت پروژه‌ها و فعالیت‌های اخیر شما"
      >
        <Link to="/dashboard/projects" className="primary-button">
          پروژه‌های من
        </Link>
      </PageHeader>

      {loading ? (
        <p className="dashboard-hint">در حال دریافت اطلاعات داشبورد…</p>
      ) : (
        <>
          <div className="dashboard-grid-stats">
            <StatCard
              icon={FiFolder}
              label="کل پروژه‌ها"
              value={stats.total_projects ?? 0}
            />
            <StatCard
              icon={FiClock}
              label="در انتظار"
              value={stats.pending_projects ?? 0}
            />
            <StatCard
              icon={FiLoader}
              label="در حال انجام"
              value={stats.active_projects ?? 0}
            />
            <StatCard
              icon={FiCheckCircle}
              label="تکمیل‌شده"
              value={stats.completed_projects ?? 0}
            />
          </div>

          <div className="dashboard-grid-2">
            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
                <h2 className="dashboard-panel-title">آخرین پروژه‌ها</h2>
                <Link to="/dashboard/projects" className="dashboard-hint">
                  مشاهده همه
                </Link>
              </div>
              {recentProjects.length ? (
                <DataTable columns={columns} rows={recentProjects} />
              ) : (
                <EmptyState
                  title="هنوز پروژه‌ای ثبت نکرده‌اید"
                  text="اولین پروژه‌تان را از بخش پروژه‌ها ثبت کنید."
                />
              )}
            </section>

            <section className="dashboard-panel">
              <div className="dashboard-panel-head">
                <h2 className="dashboard-panel-title">فعالیت‌های اخیر</h2>
                <Link to="/dashboard/history" className="dashboard-hint">
                  مشاهده همه
                </Link>
              </div>
              {historyItems.length ? (
                <HistoryList items={historyItems} />
              ) : (
                <EmptyState title="فعالیتی ثبت نشده است" />
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
