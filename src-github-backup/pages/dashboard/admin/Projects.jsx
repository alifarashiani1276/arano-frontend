import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { CATEGORIES, STATUS_META, formatMoney } from "../../../data/dashboard";
import {
  deleteAdminProject,
  getAdminProjects,
  updateAdminProject,
  updateAdminProjectStatus,
} from "../../../services/dashboardService";
import { apiMessage } from "../../../lib/api";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import FilterTabs from "../../../features/dashboard/FilterTabs";
import Modal from "../../../features/dashboard/Modal";
import PageHeader from "../../../features/dashboard/PageHeader";

const STATUSES = Object.entries(STATUS_META.project);
const FILTERS = [
  { value: "", label: "همه" },
  ...STATUSES.map(([value, meta]) => ({ value, label: meta.label })),
];

const TAG_OPTIONS = [
  { id: 1, name: "WordPress" },
  { id: 2, name: "PHP" },
  { id: 3, name: "Laravel" },
  { id: 4, name: "فروشگاهی" },
  { id: 5, name: "شرکتی" },
];

const dateForInput = (value) => (value ? String(value).slice(0, 10) : "");

function EditModal({ project, onSave, onClose, busy }) {
  const [form, setForm] = useState({
    title: project.title ?? "",
    description: project.description ?? "",
    budget: project.budget ?? "",
    category_id: project.category_id ?? project.category?.id ?? "",
    deadline: dateForInput(project.deadline),
  });
  const [tags, setTags] = useState(project.tags?.map((tag) => tag.id) ?? []);

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const toggle = (id) =>
    setTags((current) =>
      current.includes(id)
        ? current.filter((tagId) => tagId !== id)
        : [...current, id],
    );

  return (
    <Modal
      title="ویرایش پروژه"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-button" onClick={onClose}>
            انصراف
          </button>
          <button
            type="button"
            className="primary-button"
            disabled={busy}
            onClick={() =>
              onSave({
                ...form,
                budget: Number(form.budget),
                category_id: Number(form.category_id),
                tags,
              })
            }
          >
            {busy ? "در حال ذخیره…" : "ذخیره"}
          </button>
        </>
      }
    >
      <dl className="dashboard-kv">
        <dt>کاربر</dt>
        <dd>
          {project.user?.first_name ?? ""} {project.user?.last_name ?? ""}
        </dd>
        <dt>دسته‌بندی فعلی</dt>
        <dd>{project.category?.name ?? "—"}</dd>
      </dl>

      <div className="dashboard-stack">
        <div className="dashboard-field">
          <label htmlFor="a-title" className="dashboard-label">
            عنوان
          </label>
          <input
            id="a-title"
            className="dashboard-input"
            value={form.title}
            onChange={set("title")}
          />
        </div>

        <div className="dashboard-field">
          <label htmlFor="a-description" className="dashboard-label">
            توضیحات
          </label>
          <textarea
            id="a-description"
            rows={4}
            className="dashboard-input"
            value={form.description}
            onChange={set("description")}
          />
        </div>

        <div className="dashboard-field">
          <label htmlFor="a-category" className="dashboard-label">
            دسته‌بندی
          </label>
          <select
            id="a-category"
            className="dashboard-input"
            value={form.category_id}
            onChange={set("category_id")}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard-field">
          <label htmlFor="a-budget" className="dashboard-label">
            بودجه (تومان)
          </label>
          <input
            id="a-budget"
            type="number"
            min="0"
            dir="ltr"
            className="dashboard-input text-left"
            value={form.budget}
            onChange={set("budget")}
          />
        </div>

        <div className="dashboard-field">
          <label htmlFor="a-deadline" className="dashboard-label">
            مهلت تحویل
          </label>
          <input
            id="a-deadline"
            type="date"
            className="dashboard-input"
            value={form.deadline}
            onChange={set("deadline")}
          />
        </div>

        <div className="dashboard-field">
          <span className="dashboard-label">برچسب‌ها</span>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className={
                  tags.includes(tag.id)
                    ? "dashboard-chip is-on"
                    : "dashboard-chip"
                }
                aria-pressed={tags.includes(tag.id)}
                onClick={() => toggle(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAdminProjects()
      .then(setItems)
      .catch((error) => toast.error(apiMessage(error)));
  }, []);

  const changeStatus = async (project, status) => {
    try {
      const updated = await updateAdminProjectStatus(project.id, status);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success("وضعیت پروژه تغییر کرد.");
    } catch (error) {
      toast.error(apiMessage(error, "تغییر وضعیت پروژه انجام نشد."));
    }
  };

  const save = async (values) => {
    setBusy(true);
    try {
      const updated = await updateAdminProject(editing.id, values);
      setItems((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setEditing(null);
      toast.success("پروژه ویرایش شد.");
    } catch (error) {
      toast.error(apiMessage(error, "ویرایش پروژه انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removing || busy) return;

    setBusy(true);
    try {
      await deleteAdminProject(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      setRemoving(null);
      toast.success("پروژه حذف شد.");
    } catch (error) {
      toast.error(apiMessage(error, "حذف پروژه انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const rows = filter
    ? items.filter((project) => project.status === filter)
    : items;

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
      key: "deadline",
      header: "مهلت",
      render: (project) =>
        project.deadline
          ? new Date(project.deadline).toLocaleDateString("fa-IR")
          : "—",
    },
    {
      key: "status",
      header: "وضعیت",
      render: (project) => (
        <select
          className="dashboard-input w-auto py-1.5"
          aria-label={`وضعیت ${project.title}`}
          value={project.status}
          onChange={(event) => changeStatus(project, event.target.value)}
        >
          {STATUSES.map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        subtitle="مدیریت همه‌ی پروژه‌های ثبت‌شده در سیستم"
      />
      <FilterTabs options={FILTERS} value={filter} onChange={setFilter} />

      <section className="dashboard-panel">
        <DataTable
          columns={columns}
          rows={rows}
          empty={{ title: "پروژه‌ای یافت نشد" }}
          actions={(project) => (
            <>
              <button
                type="button"
                className="dashboard-icon-button"
                aria-label={`ویرایش ${project.title}`}
                onClick={() => setEditing(project)}
              >
                <FiEdit2 size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="dashboard-icon-button dashboard-icon-button--bad"
                aria-label={`حذف ${project.title}`}
                onClick={() => setRemoving(project)}
              >
                <FiTrash2 size={16} aria-hidden="true" />
              </button>
            </>
          )}
        />
      </section>

      {editing && (
        <EditModal
          project={editing}
          busy={busy}
          onClose={() => !busy && setEditing(null)}
          onSave={save}
        />
      )}

      {removing && (
        <ConfirmModal
          danger
          title="حذف پروژه"
          text={`پروژه‌ی «${removing.title}» برای همیشه حذف شود؟`}
          confirmLabel={busy ? "در حال حذف…" : "حذف"}
          onClose={() => !busy && setRemoving(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
