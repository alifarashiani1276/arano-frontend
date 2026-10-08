import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { CATEGORIES, formatMoney } from "../../../data/dashboard";
import {
  createUserProject,
  deleteUserProject,
  getUserProjects,
  updateUserProject,
} from "../../../services/dashboardService";
import { apiMessage } from "../../../lib/api";
import ConfirmModal from "../../../features/dashboard/ConfirmModal";
import DataTable from "../../../features/dashboard/DataTable";
import Modal from "../../../features/dashboard/Modal";
import PageHeader from "../../../features/dashboard/PageHeader";
import StatusBadge from "../../../features/dashboard/StatusBadge";

const TAG_OPTIONS = [
  { id: 1, name: "WordPress" },
  { id: 2, name: "PHP" },
  { id: 3, name: "Laravel" },
  { id: 4, name: "فروشگاهی" },
  { id: 5, name: "شرکتی" },
];

const EMPTY = {
  title: "",
  description: "",
  budget: "",
  category_id: CATEGORIES[0]?.id ?? "",
  deadline: "",
};

const dateForInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

function ProjectModal({ project, onSave, onClose, busy }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: project
      ? {
          title: project.title ?? "",
          description: project.description ?? "",
          budget: project.budget ?? "",
          category_id: project.category_id ?? project.category?.id ?? "",
          deadline: dateForInput(project.deadline),
        }
      : EMPTY,
  });

  const [tags, setTags] = useState(project?.tags?.map((tag) => tag.id) ?? []);

  const toggle = (id) =>
    setTags((current) =>
      current.includes(id)
        ? current.filter((tagId) => tagId !== id)
        : [...current, id],
    );

  return (
    <Modal
      title={project ? "ویرایش پروژه" : "پروژه‌ی جدید"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-button" onClick={onClose}>
            انصراف
          </button>
          <button
            type="submit"
            form="project-form"
            className="primary-button"
            disabled={busy}
          >
            {busy ? "در حال ذخیره…" : "ذخیره"}
          </button>
        </>
      }
    >
      <form
        id="project-form"
        className="dashboard-stack"
        noValidate
        onSubmit={handleSubmit((values) =>
          onSave({
            ...values,
            category_id: Number(values.category_id),
            budget: Number(values.budget),
            tags,
          }),
        )}
      >
        <div className="dashboard-field">
          <label htmlFor="p-title" className="dashboard-label">
            عنوان
          </label>
          <input
            id="p-title"
            className="dashboard-input"
            {...register("title", {
              required: "عنوان را وارد کنید.",
              minLength: { value: 3, message: "عنوان کوتاه است." },
            })}
          />
          {errors.title && (
            <p className="dashboard-error">{errors.title.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="p-desc" className="dashboard-label">
            توضیحات
          </label>
          <textarea
            id="p-desc"
            rows={3}
            className="dashboard-input"
            {...register("description", {
              required: "توضیحات را وارد کنید.",
              minLength: { value: 10, message: "توضیحات کوتاه است." },
            })}
          />
          {errors.description && (
            <p className="dashboard-error">{errors.description.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="p-cat" className="dashboard-label">
            دسته‌بندی
          </label>
          <select
            id="p-cat"
            className="dashboard-input"
            {...register("category_id", { required: true })}
          >
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dashboard-field">
          <label htmlFor="p-budget" className="dashboard-label">
            بودجه (تومان)
          </label>
          <input
            id="p-budget"
            type="number"
            min="0"
            dir="ltr"
            className="dashboard-input text-left"
            {...register("budget", {
              required: "بودجه را وارد کنید.",
              min: { value: 0, message: "بودجه معتبر نیست." },
            })}
          />
          {errors.budget && (
            <p className="dashboard-error">{errors.budget.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <label htmlFor="p-deadline" className="dashboard-label">
            مهلت تحویل
          </label>
          <input
            id="p-deadline"
            type="date"
            className="dashboard-input"
            {...register("deadline", { required: "مهلت تحویل را وارد کنید." })}
          />
          {errors.deadline && (
            <p className="dashboard-error">{errors.deadline.message}</p>
          )}
        </div>

        <div className="dashboard-field">
          <span className="dashboard-label">برچسب‌ها</span>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                aria-pressed={tags.includes(tag.id)}
                className={
                  tags.includes(tag.id)
                    ? "dashboard-chip is-on"
                    : "dashboard-chip"
                }
                onClick={() => toggle(tag.id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}

const projectTags = (project) =>
  project.tags?.map((tag) => tag.name).join("، ") || "—";

export default function UserProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getUserProjects());
    } catch (error) {
      toast.error(apiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (values) => {
    setBusy(true);
    try {
      const project =
        editing === "new"
          ? await createUserProject(values)
          : await updateUserProject(editing.id, values);

      setItems((current) =>
        editing === "new"
          ? [project, ...current]
          : current.map((item) => (item.id === project.id ? project : item)),
      );

      setEditing(null);
      toast.success(editing === "new" ? "پروژه ثبت شد." : "پروژه ویرایش شد.");
    } catch (error) {
      toast.error(apiMessage(error, "ذخیره پروژه انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteUserProject(removing.id);
      setItems((current) => current.filter((item) => item.id !== removing.id));
      setRemoving(null);
      toast.success("پروژه حذف شد.");
    } catch (error) {
      toast.error(apiMessage(error, "حذف پروژه انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

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
    { key: "tags", header: "برچسب‌ها", render: projectTags },
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
      <PageHeader
        title="پروژه‌های من"
        subtitle="پروژه‌های خود را ثبت، ویرایش و پیگیری کنید"
      >
        <button
          type="button"
          className="primary-button"
          onClick={() => setEditing("new")}
        >
          <FiPlus aria-hidden="true" /> پروژه‌ی جدید
        </button>
      </PageHeader>

      <section className="dashboard-panel">
        {loading ? (
          <p className="dashboard-hint">در حال دریافت پروژه‌ها…</p>
        ) : (
          <DataTable
            columns={columns}
            rows={items}
            empty={{
              title: "هنوز پروژه‌ای ثبت نکرده‌اید",
              text: "با دکمه‌ی «پروژه‌ی جدید» اولین پروژه‌تان را ثبت کنید.",
            }}
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
        )}
      </section>

      {editing && (
        <ProjectModal
          project={editing === "new" ? null : editing}
          onSave={save}
          onClose={() => setEditing(null)}
          busy={busy}
        />
      )}

      {removing && (
        <ConfirmModal
          danger
          title="حذف پروژه"
          text={`پروژه‌ی «${removing.title}» حذف شود؟`}
          confirmLabel={busy ? "در حال حذف…" : "حذف"}
          onClose={() => !busy && setRemoving(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
