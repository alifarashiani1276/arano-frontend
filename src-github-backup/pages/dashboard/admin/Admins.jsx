import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiPlus, FiPower } from "react-icons/fi";
import { apiMessage } from "../../../lib/api";
import {
  createAdmin,
  getAdmins,
  toggleAdmin,
} from "../../../services/dashboardService";
import { normalizeDigits } from "../../../lib/security";
import Modal from "../../../features/dashboard/Modal";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

const MOBILE_REGEX = /^09\d{9}$/;

function CreateModal({ onClose, onCreate, busy }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { phone: "" },
  });

  return (
    <Modal
      title="مدیر جدید"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-button" onClick={onClose}>
            انصراف
          </button>
          <button
            type="submit"
            form="admin-form"
            className="primary-button"
            disabled={busy}
          >
            {busy ? "در حال ثبت…" : "ایجاد مدیر"}
          </button>
        </>
      }
    >
      <form
        id="admin-form"
        className="dashboard-stack"
        noValidate
        onSubmit={handleSubmit((values) =>
          onCreate(normalizeDigits(values.phone)),
        )}
      >
        <div className="dashboard-field">
          <label htmlFor="admin-phone" className="dashboard-label">
            شماره موبایل
          </label>
          <input
            id="admin-phone"
            dir="ltr"
            inputMode="numeric"
            placeholder="09123456789"
            className="dashboard-input text-left"
            {...register("phone", {
              required: "شماره موبایل را وارد کنید.",
              validate: (value) =>
                MOBILE_REGEX.test(normalizeDigits(value)) ||
                "شماره موبایل معتبر نیست.",
            })}
          />
          {errors.phone && (
            <p className="dashboard-error">{errors.phone.message}</p>
          )}
          <p className="dashboard-hint">
            مدیر جدید بعداً با OTP وارد مرحله تکمیل پروفایل می‌شود.
          </p>
        </div>
      </form>
    </Modal>
  );
}

export default function Admins() {
  const [items, setItems] = useState([]);
  const [creating, setCreating] = useState(false);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    getAdmins()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));

  useEffect(() => {
    load();
  }, []);

  const create = async (phone) => {
    setBusy(true);
    try {
      const admin = await createAdmin(phone);
      setItems((current) => [admin, ...current]);
      setCreating(false);
      toast.success("مدیر جدید ثبت شد.");
    } catch (error) {
      toast.error(apiMessage(error, "ثبت مدیر جدید انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const toggle = async () => {
    if (!target || busy) return;

    setBusy(true);
    try {
      const updated = await toggleAdmin(target.id);
      setItems((current) =>
        current.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
      setTarget(null);
      toast.success(updated.is_active ? "مدیر فعال شد." : "مدیر غیرفعال شد.");
    } catch (error) {
      toast.error(apiMessage(error, "تغییر وضعیت مدیر انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "نام",
      render: (admin) => (
        <>
          <span className="dashboard-cell-main">
            {admin.first_name || "تکمیل نشده"} {admin.last_name || ""}
          </span>
          <span className="dashboard-cell-sub" dir="ltr">
            {admin.email || "—"}
          </span>
        </>
      ),
    },
    {
      key: "phone",
      header: "موبایل",
      render: (admin) => <span dir="ltr">{admin.phone}</span>,
    },
    {
      key: "role",
      header: "نقش",
      render: (admin) => <StatusBadge kind="role" value={admin.role} />,
    },
    {
      key: "status",
      header: "وضعیت",
      render: (admin) => <StatusBadge kind="account" value={admin.status} />,
    },
    {
      key: "is_active",
      header: "فعال",
      render: (admin) => <StatusBadge kind="active" value={admin.is_active} />,
    },
  ];

  return (
    <>
      <PageHeader title="مدیریت مدیران" subtitle="فقط برای مدیر ارشد">
        <button
          type="button"
          className="primary-button"
          onClick={() => setCreating(true)}
        >
          <FiPlus aria-hidden="true" /> مدیر جدید
        </button>
      </PageHeader>

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={items}
          empty={{ title: "مدیری ثبت نشده است" }}
          actions={(admin) =>
            admin.role === "ADMIN" ? (
              <button
                type="button"
                className="dashboard-icon-button"
                aria-label={admin.is_active ? "غیرفعال کردن" : "فعال کردن"}
                onClick={() => setTarget(admin)}
              >
                <FiPower size={16} aria-hidden="true" />
              </button>
            ) : (
              <span className="dashboard-hint">مدیر ارشد</span>
            )
          }
        />
      </section>

      {creating && (
        <CreateModal
          onClose={() => !busy && setCreating(false)}
          onCreate={create}
          busy={busy}
        />
      )}

      {target && (
        <ConfirmModal
          danger={target.is_active}
          title={target.is_active ? "غیرفعال کردن مدیر" : "فعال کردن مدیر"}
          text={
            target.is_active
              ? `حساب ${target.first_name} ${target.last_name} غیرفعال شود؟`
              : `حساب ${target.first_name} ${target.last_name} فعال شود؟`
          }
          confirmLabel={busy ? "در حال انجام…" : "تأیید"}
          onClose={() => !busy && setTarget(null)}
          onConfirm={toggle}
        />
      )}
    </>
  );
}
