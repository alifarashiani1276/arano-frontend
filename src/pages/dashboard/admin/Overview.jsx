import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiLoader,
  FiMessageSquare,
  FiUserCheck,
  FiUserX,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  getAdminDashboard,
  getAdminRequests,
} from "../../../services/dashboardService";
import DataTable from "../../../features/dashboard/DataTable";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatCard from "../../../features/dashboard/StatCard";

export default function AdminOverview() {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminRequests()])
      .then(([dashboardData, requestData]) => {
        setDashboard(dashboardData);
        setRequests(requestData);
      })
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  if (!dashboard) {
    return (
      <>
        <PageHeader
          title="نمای کلی"
          subtitle="آمار کاربران، پروژه‌ها و پشتیبانی"
        />
        <p className="dashboard-hint">در حال دریافت اطلاعات داشبورد…</p>
      </>
    );
  }

  const users = dashboard.stats?.users ?? {};
  const projects = dashboard.stats?.projects ?? {};
  const conversations = dashboard.stats?.conversations ?? {};

  const columns = [
    {
      key: "name",
      header: "نام",
      render: (request) => (
        <>
          <span className="dashboard-cell-main">
            {request.first_name} {request.last_name}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            {request.email || "—"}
          </span>
        </>
      ),
    },
    {
      key: "phone",
      header: "موبایل",
      render: (request) => <span dir="ltr">{request.phone}</span>,
    },
    {
      key: "created_at",
      header: "تاریخ ثبت",
      render: (request) =>
        request.created_at
          ? new Date(request.created_at).toLocaleDateString("fa-IR")
          : "—",
    },
  ];

  return (
    <>
      <PageHeader title="نمای کلی" subtitle="آمار واقعی سیستم مدیریت آرا نو" />

      <section className="dashboard-stack">
        <h2 className="dashboard-panel-title">کاربران</h2>
        <div className="dashboard-grid-stats">
          <StatCard
            icon={FiUsers}
            label="کل کاربران"
            value={users.total ?? 0}
          />
          <StatCard
            icon={FiClock}
            label="در انتظار تأیید"
            value={users.pending ?? 0}
          />
          <StatCard
            icon={FiUserCheck}
            label="تأییدشده"
            value={users.approved ?? 0}
          />
          <StatCard icon={FiUserX} label="ردشده" value={users.rejected ?? 0} />
        </div>
      </section>

      <section className="dashboard-stack">
        <h2 className="dashboard-panel-title">پروژه‌ها</h2>
        <div className="dashboard-grid-stats">
          <StatCard
            icon={FiFolder}
            label="کل پروژه‌ها"
            value={projects.total ?? 0}
          />
          <StatCard
            icon={FiAlertCircle}
            label="در انتظار"
            value={projects.pending ?? 0}
          />
          <StatCard
            icon={FiLoader}
            label="در حال انجام"
            value={projects.active ?? 0}
          />
          <StatCard
            icon={FiCheckCircle}
            label="تکمیل‌شده"
            value={projects.completed ?? 0}
          />
          <StatCard
            icon={FiUserX}
            label="لغوشده"
            value={projects.cancelled ?? 0}
          />
          <StatCard
            icon={FiMessageSquare}
            label="گفتگوی باز"
            value={conversations.open ?? 0}
          />
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-head">
          <h2 className="dashboard-panel-title">درخواست‌های در انتظار تأیید</h2>
          <Link to="/admin/requests" className="dashboard-hint">
            بررسی درخواست‌ها
          </Link>
        </div>
        <DataTable
          columns={columns}
          rows={requests}
          empty={{ title: "درخواستی در انتظار نیست" }}
        />
      </section>
    </>
  );
}
