import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  changeUserRole,
  getAdminUsers,
} from "../../../services/dashboardService";
import { useSession } from "../../../features/auth/session";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

export default function Roles() {
  const currentAdmin = useSession();
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminUsers()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const toAdmin = target?.role === "USER";

  const change = async () => {
    if (!target || busy) return;

    setBusy(true);
    try {
      const updated = await changeUserRole(
        target.id,
        toAdmin ? "ADMIN" : "USER",
      );

      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setTarget(null);
      toast.success(
        toAdmin ? "کاربر به مدیر تبدیل شد." : "مدیر به کاربر تبدیل شد.",
      );
    } catch (error) {
      toast.error(apiMessage(error, "تغییر نقش انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "نام",
      render: (user) => (
        <span className="dashboard-cell-main">
          {user.first_name || "—"} {user.last_name || ""}
        </span>
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
      header: "وضعیت",
      render: (user) => <StatusBadge kind="account" value={user.status} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="تغییر نقش کاربران"
        subtitle="فقط مدیر ارشد می‌تواند USER و ADMIN را تبدیل کند"
      />

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={items}
          empty={{ title: "حسابی یافت نشد" }}
          actions={(user) =>
            user.role === "SUPER_ADMIN" || user.id === currentAdmin?.id ? (
              <span className="dashboard-hint">غیرقابل تغییر</span>
            ) : (
              <button
                type="button"
                className="secondary-button h-9"
                onClick={() => setTarget(user)}
              >
                {user.role === "USER" ? (
                  <>
                    <FiArrowUp aria-hidden="true" /> ارتقا به مدیر
                  </>
                ) : (
                  <>
                    <FiArrowDown aria-hidden="true" /> تبدیل به کاربر
                  </>
                )}
              </button>
            )
          }
        />
      </section>

      {target && (
        <ConfirmModal
          danger={!toAdmin}
          title={toAdmin ? "ارتقا به مدیر" : "تبدیل مدیر به کاربر"}
          text={
            toAdmin
              ? `${target.first_name} ${target.last_name} مدیر شود؟ حساب برای تکمیل ورود مدیریتی به وضعیت انتظار می‌رود.`
              : `نقش ${target.first_name} ${target.last_name} به کاربر تغییر کند؟ نشست‌های قبلی او باطل می‌شود.`
          }
          confirmLabel={busy ? "در حال انجام…" : "تأیید"}
          onClose={() => !busy && setTarget(null)}
          onConfirm={change}
        />
      )}
    </>
  );
}
