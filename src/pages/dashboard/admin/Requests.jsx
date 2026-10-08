import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  approveAdminRequest,
  getAdminRequests,
  rejectAdminRequest,
} from "../../../services/dashboardService";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

export default function AdminRequests() {
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminRequests()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const decide = async (status) => {
    if (!target || busy) return;

    setBusy(true);
    try {
      const updated =
        status === "APPROVED"
          ? await approveAdminRequest(target.id)
          : await rejectAdminRequest(target.id);

      setItems((current) =>
        current.filter((request) => request.id !== updated.id),
      );
      setTarget(null);
      toast.success(
        status === "APPROVED" ? "کاربر تأیید شد." : "درخواست کاربر رد شد.",
      );
    } catch (error) {
      toast.error(apiMessage(error, "تغییر وضعیت درخواست انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

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
    {
      key: "status",
      header: "وضعیت",
      render: (request) => (
        <StatusBadge kind="account" value={request.status} />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="درخواست‌های کاربران"
        subtitle="فقط درخواست‌های در انتظار تأیید در این بخش نمایش داده می‌شوند"
      />

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={items}
          empty={{ title: "درخواستی در انتظار تأیید نیست" }}
          actions={(request) => (
            <>
              <button
                type="button"
                className="dashboard-icon-button dashboard-icon-button--ok"
                aria-label={`تأیید ${request.first_name} ${request.last_name}`}
                onClick={() => setTarget({ ...request, decision: "APPROVED" })}
              >
                <FiCheck size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="dashboard-icon-button dashboard-icon-button--bad"
                aria-label={`رد ${request.first_name} ${request.last_name}`}
                onClick={() => setTarget({ ...request, decision: "REJECTED" })}
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </>
          )}
        />
      </section>

      {target && (
        <ConfirmModal
          danger={target.decision === "REJECTED"}
          title={target.decision === "APPROVED" ? "تأیید کاربر" : "رد درخواست"}
          text={
            target.decision === "APPROVED"
              ? `درخواست ${target.first_name} ${target.last_name} تأیید شود؟`
              : `درخواست ${target.first_name} ${target.last_name} رد شود؟`
          }
          confirmLabel={
            busy
              ? "در حال انجام…"
              : target.decision === "APPROVED"
                ? "تأیید"
                : "رد درخواست"
          }
          onClose={() => !busy && setTarget(null)}
          onConfirm={() => decide(target.decision)}
        />
      )}
    </>
  );
}
