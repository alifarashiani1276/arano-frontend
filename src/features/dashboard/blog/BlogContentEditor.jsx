import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import toast from "react-hot-toast";
import {
  FiBold,
  FiCheckSquare,
  FiCode,
  FiGrid,
  FiImage,
  FiLink,
  FiList,
  FiMessageSquare,
  FiRotateCcw,
  FiRotateCw,
} from "react-icons/fi";
import { apiMessage } from "../../../lib/api";
import { blocksToDoc, docToBlocks } from "../../../lib/blogBlocks";
import { uploadAdminBlogImage } from "../../../services/adminBlogService";
import { editorExtensions } from "./editorExtensions";
import "./blogEditor.css";

const MAX_IMAGE_MB = 8;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// لینک مجاز: مسیر داخلی (/...) یا https://...
const LINK_OK = /^(\/(?!\/)[^\s)]*|https:\/\/[^\s)]+)$/;

const EMPTY_FORM = { href: "", cite: "", lang: "", start: "1", alt: "", caption: "", rows: "3", cols: "3" };

const btn = (active) =>
  `dashboard-icon-button ${active ? "!bg-primary/15 !text-primary" : ""}`;

function ToolButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      className={btn(active)}
      title={label}
      aria-label={label}
      aria-pressed={active ? "true" : "false"}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

// value: آرایه‌ی بلوک‌ها | onChange(blocks) | dir: "rtl" برای فارسی، "ltr" برای نسخه‌ی انگلیسی
// ویرایشگر فقط مقدار اولیه را می‌خواند؛ برای مقدار تازه (مثلاً بعد از لود مقاله) از key استفاده کنید.
export default function BlogContentEditor({ value, onChange, dir = "rtl" }) {
  const onChangeRef = useRef(onChange);
  const fileRef = useRef(null);
  const [panel, setPanel] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  // مقدار اولیه یک بار ساخته می‌شود؛ اگر بلوک ناشناخته بود با سند خالی شروع می‌کنیم و خطا را نشان می‌دهیم
  const [initial] = useState(() => {
    try {
      return { doc: blocksToDoc(value), error: "" };
    } catch (e) {
      return { doc: blocksToDoc([]), error: e.message };
    }
  });

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    extensions: editorExtensions,
    content: initial.doc,
    editorProps: {
      attributes: {
        dir,
        lang: dir === "rtl" ? "fa" : "en",
        class: `blog-editor ${dir === "ltr" ? "is-ltr" : ""}`,
        "aria-label": "متن مقاله",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChangeRef.current?.(docToBlocks(instance.getJSON()));
    },
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e && {
        h2: e.isActive("heading", { level: 2 }),
        h3: e.isActive("heading", { level: 3 }),
        bold: e.isActive("bold"),
        link: e.isActive("link"),
        linkHref: e.getAttributes("link").href ?? "",
        ul: e.isActive("bulletList"),
        ol: e.isActive("orderedList"),
        olStart: e.getAttributes("orderedList").start ?? 1,
        quote: e.isActive("blockquote"),
        quoteCite: e.getAttributes("blockquote").cite ?? "",
        image: e.isActive("image"),
        imageAlt: e.getAttributes("image").alt ?? "",
        imageCaption: e.getAttributes("image").caption ?? "",
        code: e.isActive("codeBlock"),
        codeLang: e.getAttributes("codeBlock").language ?? "",
        table: e.isActive("table"),
        task: e.isActive("taskList"),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
        selectionEmpty: e.state.selection.empty,
      },
  });

  if (!editor || !state) return null;

  const run = () => editor.chain().focus();
  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError("");
  };
  const open = (name, values = {}) => {
    setForm({ ...EMPTY_FORM, ...values });
    setError("");
    setPanel((current) => (current === name ? null : name));
  };
  const close = () => {
    setPanel(null);
    setError("");
    editor.commands.focus();
  };

  const applyLink = () => {
    const href = form.href.trim();
    if (!LINK_OK.test(href)) {
      return setError("آدرس باید با / (مسیر داخلی) یا https:// شروع شود و فاصله نداشته باشد.");
    }
    if (state.selectionEmpty && !state.link) {
      return setError("ابتدا متنی را که می‌خواهید لینک شود انتخاب کنید.");
    }
    run().extendMarkRange("link").setLink({ href }).run();
    close();
  };

  const applyQuote = () => {
    const cite = form.cite.trim() || null;
    if (!state.quote && !run().toggleBlockquote().run()) {
      return setError("نقل‌قول فقط یک پاراگراف می‌گیرد؛ مکان‌نما را داخل یک پاراگراف بگذارید.");
    }
    editor.chain().focus().updateAttributes("blockquote", { cite }).run();
    close();
  };

  const applyCode = () => {
    const language = form.lang.trim().toLowerCase() || null;
    if (!/^[a-z0-9+#._-]*$/.test(language ?? "")) {
      return setError("نام زبان فقط حروف انگلیسی، عدد و + # . _ - داشته باشد.");
    }
    if (state.code) run().updateAttributes("codeBlock", { language }).run();
    else run().setCodeBlock({ language }).run();
    close();
  };

  const applyStart = () => {
    const start = Number(form.start);
    if (!Number.isInteger(start) || start < 1) return setError("عدد شروع باید صحیح و حداقل ۱ باشد.");
    if (!state.ol) run().toggleOrderedList().run();
    editor.chain().focus().updateAttributes("orderedList", { start }).run();
    close();
  };

  const applyTable = () => {
    const rows = Number(form.rows);
    const cols = Number(form.cols);
    if (![rows, cols].every((n) => Number.isInteger(n) && n >= 1 && n <= 12)) {
      return setError("تعداد سطر و ستون باید بین ۱ تا ۱۲ باشد.");
    }
    run().insertTable({ rows, cols, withHeaderRow: true }).run();
    close();
  };

  const applyImage = async () => {
    const alt = form.alt.trim();
    const caption = form.caption.trim();
    if (!alt) return setError("متن جایگزین (alt) اجباری است.");
    if (!caption) return setError("زیرنویس تصویر اجباری است.");

    if (state.image) {
      run().updateAttributes("image", { alt, caption }).run();
      return close();
    }

    const file = fileRef.current?.files?.[0];
    if (!file) return setError("یک فایل تصویر انتخاب کنید.");
    if (!IMAGE_TYPES.includes(file.type)) return setError("فقط JPG، PNG یا WebP پذیرفته می‌شود.");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`حجم تصویر باید کمتر از ${MAX_IMAGE_MB} مگابایت باشد.`);

    setUploading(true);
    try {
      const { url } = await uploadAdminBlogImage(file);
      run().insertContent({ type: "image", attrs: { src: url, alt, caption } }).run();
      close();
    } catch (e) {
      const first = Object.values(e.response?.data?.errors ?? {})[0];
      const message = (Array.isArray(first) ? first[0] : first) || apiMessage(e, "آپلود تصویر انجام نشد.");
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface" dir="rtl">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-border bg-surface p-2">
        <ToolButton label="عنوان ۲ (H2)" active={state.h2} onClick={() => run().toggleHeading({ level: 2 }).run()}>
          <span className="text-xs font-black">H2</span>
        </ToolButton>
        <ToolButton label="عنوان ۳ (H3)" active={state.h3} onClick={() => run().toggleHeading({ level: 3 }).run()}>
          <span className="text-xs font-black">H3</span>
        </ToolButton>
        <ToolButton label="پررنگ" active={state.bold} onClick={() => run().toggleBold().run()}>
          <FiBold size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton label="لینک" active={state.link || panel === "link"} onClick={() => open("link", { href: state.linkHref })}>
          <FiLink size={16} aria-hidden="true" />
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <ToolButton label="لیست نقطه‌ای" active={state.ul} onClick={() => run().toggleBulletList().run()}>
          <FiList size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton label="لیست شماره‌دار" active={state.ol} onClick={() => run().toggleOrderedList().run()}>
          <span className="text-xs font-black">1.</span>
        </ToolButton>
        {state.ol && (
          <ToolButton label="شروع شماره از…" active={panel === "start"} onClick={() => open("start", { start: String(state.olStart) })}>
            <span className="text-xs font-black">#</span>
          </ToolButton>
        )}
        <ToolButton label="چک‌لیست" active={state.task} onClick={() => run().toggleTaskList().run()}>
          <FiCheckSquare size={16} aria-hidden="true" />
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <ToolButton label="نقل‌قول" active={state.quote || panel === "quote"} onClick={() => open("quote", { cite: state.quoteCite })}>
          <FiMessageSquare size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="تصویر"
          active={state.image || panel === "image"}
          onClick={() => open("image", { alt: state.imageAlt, caption: state.imageCaption })}
        >
          <FiImage size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton label="بلوک کد" active={state.code || panel === "code"} onClick={() => open("code", { lang: state.codeLang })}>
          <FiCode size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton label="جدول" active={state.table || panel === "table"} onClick={() => open("table")}>
          <FiGrid size={16} aria-hidden="true" />
        </ToolButton>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <ToolButton label="بازگشت (Undo)" disabled={!state.canUndo} onClick={() => run().undo().run()}>
          <FiRotateCcw size={16} aria-hidden="true" />
        </ToolButton>
        <ToolButton label="از نو (Redo)" disabled={!state.canRedo} onClick={() => run().redo().run()}>
          <FiRotateCw size={16} aria-hidden="true" />
        </ToolButton>
      </div>

      {state.table && (
        <div className="flex flex-wrap gap-1 border-b border-border bg-surface-2 p-2 text-xs">
          {[
            ["سطر بعد", () => run().addRowAfter().run()],
            ["ستون بعد", () => run().addColumnAfter().run()],
            ["حذف سطر", () => run().deleteRow().run()],
            ["حذف ستون", () => run().deleteColumn().run()],
            ["حذف جدول", () => run().deleteTable().run()],
          ].map(([label, action]) => (
            <button key={label} type="button" className="secondary-button" onMouseDown={(e) => e.preventDefault()} onClick={action}>
              {label}
            </button>
          ))}
        </div>
      )}

      {panel && (
        <div className="grid gap-3 border-b border-border bg-surface-2 p-3">
          {panel === "link" && (
            <Field label="آدرس لینک (مثلاً /services/seo یا https://example.com)">
              <input dir="ltr" className="dashboard-input" value={form.href} onChange={set("href")} autoFocus />
            </Field>
          )}
          {panel === "quote" && (
            <Field label="منبع نقل‌قول (اختیاری)">
              <input className="dashboard-input" value={form.cite} onChange={set("cite")} autoFocus />
            </Field>
          )}
          {panel === "code" && (
            <Field label="زبان کد (مثلاً js، css، php؛ اختیاری)">
              <input dir="ltr" className="dashboard-input" value={form.lang} onChange={set("lang")} autoFocus />
            </Field>
          )}
          {panel === "start" && (
            <Field label="شماره‌ی اولین آیتم">
              <input type="number" min="1" className="dashboard-input" value={form.start} onChange={set("start")} autoFocus />
            </Field>
          )}
          {panel === "table" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="تعداد سطر (با ردیف سرستون)">
                <input type="number" min="1" max="12" className="dashboard-input" value={form.rows} onChange={set("rows")} />
              </Field>
              <Field label="تعداد ستون">
                <input type="number" min="1" max="12" className="dashboard-input" value={form.cols} onChange={set("cols")} />
              </Field>
            </div>
          )}
          {panel === "image" && (
            <div className="grid gap-3">
              {state.image ? (
                <p className="text-sm text-muted">ویرایش تصویر انتخاب‌شده</p>
              ) : (
                <Field label={`فایل تصویر (JPG، PNG یا WebP، حداکثر ${MAX_IMAGE_MB} مگابایت)`}>
                  <input ref={fileRef} type="file" accept={IMAGE_TYPES.join(",")} className="dashboard-input" />
                </Field>
              )}
              <Field label="متن جایگزین (alt) — اجباری">
                <input className="dashboard-input" value={form.alt} onChange={set("alt")} />
              </Field>
              <Field label="زیرنویس — اجباری">
                <input className="dashboard-input" value={form.caption} onChange={set("caption")} />
              </Field>
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="primary-button"
              disabled={uploading}
              onClick={() =>
                ({ link: applyLink, quote: applyQuote, code: applyCode, start: applyStart, table: applyTable, image: applyImage })[panel]()
              }
            >
              {uploading ? "در حال آپلود…" : "اعمال"}
            </button>
            <button type="button" className="secondary-button" onClick={close}>
              انصراف
            </button>
            {panel === "link" && state.link && (
              <button
                type="button"
                className="danger-button"
                onClick={() => {
                  run().extendMarkRange("link").unsetLink().run();
                  close();
                }}
              >
                حذف لینک
              </button>
            )}
          </div>
        </div>
      )}

      {initial.error && (
        <p role="alert" className="border-b border-border px-4 py-2 text-sm text-red-600">
          بارگذاری بخشی از محتوا ممکن نشد: {initial.error}
        </p>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
