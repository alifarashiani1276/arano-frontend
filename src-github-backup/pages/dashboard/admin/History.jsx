import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  getAdminProjectHistory,
  getAdminUserHistory,
} from "../../../services/dashboardService";
import DataTable from "../../../features/dashboard/DataTable";
import FilterTabs from "../../../features/dashboard/FilterTabs";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";
import { formatMoney } from "../../../data/dashboard";

const FILTERS = [
  { value: "projects", label: "تاریخچه پروژه‌ها" },
  { value: "users", label: "تاریخچه کاربران" },
];

export default function AdminHistory() {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getAdminProjectHistory(), getAdminUserHistory()])
      .then(([projectHistory, userHistory]) => {
        setProjects(projectHistory);
        setUsers(userHistory);
      })
      .catch((error) => toast.error(apiMessage(error)))
      .finally(() => setLoaded(true));
  }, []);

  const projectColumns = [
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
      key: "user",
      header: "کاربر",
      render: (project) =>
        `${project.user?.first_name ?? ""} ${project.user?.last_name ?? ""}`.trim() ||
        project.user?.phone ||
        "—",
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
    {
      key: "updated_at",
      header: "آخرین تغییر",
      render: (project) =>
        project.updated_at
          ? new Date(project.updated_at).toLocaleString("fa-IR")
          : "—",
    },
  ];

  const userColumns = [
    {
      key: "name",
      header: "نام",
      render: (user) => (
        <>
          <span className="dashboard-cell-main">
            {user.first_name || "—"} {user.last_name || ""}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            {user.email || "—"}
          </span>
        </>
      ),
    },
    {
      key: "phone",
      header: "موبایل",
      render: (user) => <span dir="ltr">{user.phone}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (user) => <StatusBadge kind="account" value={user.status} />,
    },
    {
      key: "projects_count",
      header: "پروژه",
      render: (user) => user.projects_count ?? 0,
    },
    {
      key: "conversations_count",
      header: "گفتگو",
      render: (user) => user.conversations_count ?? 0,
    },
    {
      key: "updated_at",
      header: "آخرین تغییر",
      render: (user) =>
        user.updated_at
          ? new Date(user.updated_at).toLocaleString("fa-IR")
          : "—",
    },
  ];

  return (
    <>
      <PageHeader title="تاریخچه" subtitle="سوابق پروژه‌ها و کاربران سیستم" />
      <FilterTabs options={FILTERS} value={tab} onChange={setTab} />

      {!loaded ? (
        <p className="dashboard-hint">در حال دریافت تاریخچه…</p>
      ) : (
        <section className="dashboard-panel">
          {tab === "projects" ? (
            <DataTable
              columns={projectColumns}
              rows={projects}
              empty={{ title: "سابقه پروژه‌ای یافت نشد" }}
            />
          ) : (
            <DataTable
              columns={userColumns}
              rows={users}
              empty={{ title: "سابقه کاربری یافت نشد" }}
            />
          )}
        </section>
      )}
    </>
  );
}
