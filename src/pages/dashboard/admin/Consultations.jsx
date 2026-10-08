import { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiMessage } from "../../../lib/api";
import {
  getAdminConsultations,
  getAdminConsultation,
  updateAdminConsultationStatus,
} from "../../../services/dashboardService";
import DataTable from "../../../features/dashboard/DataTable";
import FilterTabs from "../../../features/dashboard/FilterTabs";
import Modal from "../../../features/dashboard/Modal";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

const FILTERS = [
  { value: "", label: "همه" },
  { value: "UNANSWERED", label: "پاسخ‌داده‌نشده" },
  { value: "ANSWERED", label: "پاسخ‌داده‌شده" },
];

function ConsultationModal({ item, onClose }) {
  if (!item) return null;

  return (
    <Modal
      title="جزئیات درخواست مشاوره"
      onClose={onClose}
      footer={
        <button type="button" className="secondary-button" onClick={onClose}>
          بستن
        </button>
      }
    >
      <dl className="dashboard-kv">
        <dt>نام</dt>
        <dd>
          {item.first_name} {item.last_name}
        </dd>
        <dt>موبایل</dt>
        <dd dir="ltr">{item.phone}</dd>
        <dt>وضعیت</dt>
        <dd>
          <StatusBadge kind="account" value={item.status} />
        </dd>
      </dl>
      <div className="dashboard-panel mt-4">
        <p className="dashboard-panel-title mb-2">متن درخواست</p>
        <p className="text-sm leading-7 whitespace-pre-wrap">{item.message}</p>
      </div>
    </Modal>
  );
}

export default function AdminConsultations() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAdminConsultations()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const show = async (id) => {
    try {
      setSelected(await getAdminConsultation(id));
    } catch (error) {
      toast.error(apiMessage(error, "دریافت درخواست مشاوره انجام نشد."));
    }
  };

  const changeStatus = async (item) => {
    const next = item.status === "UNANSWERED" ? "ANSWERED" : "UNANSWERED";

    try {
      const updated = await updateAdminConsultationStatus(item.id, next);
      setItems((current) =>
        current.map((row) => (row.id === updated.id ? updated : row)),
      );
      if (selected?.id === updated.id) setSelected(updated);
      toast.success("وضعیت درخواست تغییر کرد.");
    } catch (error) {
      toast.error(apiMessage(error, "تغییر وضعیت مشاوره انجام نشد."));
    }
  };

  const rows = filter ? items.filter((item) => item.status === filter) : items;

  const columns = [
    {
      key: "name",
      header: "درخواست‌دهنده",
      render: (item) => (
        <>
          <span className="dashboard-cell-main">
            {item.first_name} {item.last_name}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            {item.phone}
          </span>
        </>
      ),
    },
    {
      key: "message",
      header: "درخواست",
      render: (item) => (
        <span className="dashboard-cell-main max-w-[24rem]">
          {item.message}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      render: (item) => <StatusBadge kind="consultation" value={item.status} />,
    },
    {
      key: "created_at",
      header: "تاریخ",
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleString("fa-IR")
          : "—",
    },
  ];

  return (
    <>
      <PageHeader
        title="درخواست‌های مشاوره"
        subtitle="درخواست‌های عمومی ثبت‌شده از صفحه اصلی"
      />
      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={rows}
          empty={{ title: "درخواست مشاوره‌ای یافت نشد" }}
          actions={(item) => (
            <>
              <button
                type="button"
                className="dashboard-icon-button"
                aria-label="مشاهده درخواست"
                onClick={() => show(item.id)}
              >
                <FiEye size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="secondary-button h-9"
                onClick={() => changeStatus(item)}
              >
                {item.status === "UNANSWERED"
                  ? "پاسخ داده شد"
                  : "بازگشت به بی‌پاسخ"}
              </button>
            </>
          )}
        />
      </section>

      {selected && (
        <ConsultationModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
