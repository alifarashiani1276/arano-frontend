import { useEffect, useState } from "react";
import { FiPower } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  getAdminUsers,
  toggleAdminUser,
} from "../../../services/dashboardService";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import FilterTabs from "../../../features/dashboard/FilterTabs";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

const FILTERS = [
  { value: "", label: "همه" },
  { value: "USER", label: "کاربران" },
  { value: "ADMIN", label: "مدیران" },
];

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminUsers()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const toggle = async () => {
    if (!target || busy) return;

    setBusy(true);
    try {
      const updated = await toggleAdminUser(target.id);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setTarget(null);
      toast.success(updated.is_active ? "حساب فعال شد." : "حساب غیرفعال شد.");
    } catch (error) {
      toast.error(apiMessage(error, "تغییر وضعیت حساب انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const rows = filter ? items.filter((item) => item.role === filter) : items;

  const columns = [
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
      key: "role",
      header: "نقش",
      render: (user) => <StatusBadge kind="role" value={user.role} />,
    },
    {
      key: "status",
      header: "تأیید",
      render: (user) => <StatusBadge kind="account" value={user.status} />,
    },
    {
      key: "is_active",
      header: "فعال",
      render: (user) => <StatusBadge kind="active" value={user.is_active} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="کاربران"
        subtitle="مدیریت وضعیت حساب کاربران و مدیران"
      />

      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={rows}
          empty={{ title: "کاربری یافت نشد" }}
          actions={(user) => (
            <button
              type="button"
              className="dashboard-icon-button"
              aria-label={user.is_active ? "غیرفعال کردن" : "فعال کردن"}
              onClick={() => setTarget(user)}
            >
              <FiPower size={16} aria-hidden="true" />
            </button>
          )}
        />
      </section>

      {target && (
        <ConfirmModal
          danger={target.is_active}
          title={target.is_active ? "غیرفعال کردن حساب" : "فعال کردن حساب"}
          text={
            target.is_active
              ? `حساب ${target.first_name ?? ""} ${target.last_name ?? ""} غیرفعال شود؟`
              : `حساب ${target.first_name ?? ""} ${target.last_name ?? ""} فعال شود؟`
          }
          confirmLabel={busy ? "در حال انجام…" : "تأیید"}
          onClose={() => !busy && setTarget(null)}
          onConfirm={toggle}
        />
      )}
    </>
  );
}
