import { useEffect, useState } from "react";
import { FiLock, FiPlus, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import EmptyState from "./EmptyState";
import Modal from "./Modal";
import StatusBadge from "./StatusBadge";
import {
  closeAdminConversation,
  createUserConversation,
  getAdminConversation,
  getAdminConversations,
  getUserConversation,
  getUserConversations,
  sendAdminMessage,
  sendUserMessage,
} from "../../services/dashboardService";
import { apiMessage } from "../../lib/api";

const normalizeMessage = (message) => ({
  id: message.id,
  from: message.sender_role,
  text: message.message,
  time: message.created_at
    ? new Date(message.created_at).toLocaleString("fa-IR")
    : "",
});

const normalizeConversation = (conversation) => ({
  ...conversation,
  user: conversation.user
    ? `${conversation.user.first_name ?? ""} ${conversation.user.last_name ?? ""}`.trim() ||
      conversation.user.phone
    : "",
  updated_at: conversation.updated_at
    ? new Date(conversation.updated_at).toLocaleString("fa-IR")
    : "",
  messages: (conversation.messages ?? []).map(normalizeMessage),
});

export default function ConversationPanel({ viewer }) {
  const isAdmin = viewer === "ADMIN";
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [active, setActive] = useState(null);
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ subject: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const rows = isAdmin
          ? await getAdminConversations()
          : await getUserConversations();

        if (!mounted) return;

        const normalized = rows.map(normalizeConversation);
        setItems(normalized);
        setActiveId(normalized[0]?.id ?? null);
      } catch (error) {
        if (mounted)
          toast.error(apiMessage(error, "دریافت گفتگوها انجام نشد."));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  useEffect(() => {
    if (!activeId) {
      setActive(null);
      return;
    }

    let mounted = true;

    const loadConversation = async () => {
      try {
        const conversation = isAdmin
          ? await getAdminConversation(activeId)
          : await getUserConversation(activeId);

        if (!mounted) return;
        setActive(normalizeConversation(conversation));
      } catch (error) {
        if (mounted) toast.error(apiMessage(error, "دریافت گفتگو انجام نشد."));
      }
    };

    loadConversation();

    return () => {
      mounted = false;
    };
  }, [activeId, isAdmin]);

  const send = async (event) => {
    event.preventDefault();

    if (!text.trim() || !active || active.status === "CLOSED" || busy) {
      return;
    }

    setBusy(true);

    try {
      const message = isAdmin
        ? await sendAdminMessage(active.id, text.trim())
        : await sendUserMessage(active.id, text.trim());

      const nextMessage = normalizeMessage(message);
      setActive((current) => ({
        ...current,
        messages: [...(current.messages ?? []), nextMessage],
      }));
      setItems((current) =>
        current.map((item) =>
          item.id === active.id
            ? {
                ...item,
                updated_at: new Date().toLocaleString("fa-IR"),
              }
            : item,
        ),
      );
      setText("");
    } catch (error) {
      toast.error(apiMessage(error, "ارسال پیام انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const close = async () => {
    if (!active || busy) return;

    setBusy(true);
    try {
      const conversation = await closeAdminConversation(active.id);
      const next = normalizeConversation({
        ...active,
        ...conversation,
        messages: active.messages,
      });
      setActive(next);
      setItems((current) =>
        current.map((item) =>
          item.id === active.id ? { ...item, status: "CLOSED" } : item,
        ),
      );
      toast.success("گفتگو بسته شد.");
    } catch (error) {
      toast.error(apiMessage(error, "بستن گفتگو انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  const create = async (event) => {
    event.preventDefault();

    if (!draft.subject.trim() || !draft.text.trim() || busy) return;

    setBusy(true);
    try {
      const conversation = await createUserConversation({
        subject: draft.subject.trim(),
        message: draft.text.trim(),
      });
      const normalized = normalizeConversation(conversation);
      setItems((current) => [normalized, ...current]);
      setActiveId(normalized.id);
      setDraft({ subject: "", text: "" });
      setCreating(false);
      toast.success("گفتگوی جدید ثبت شد.");
    } catch (error) {
      toast.error(apiMessage(error, "ایجاد گفتگو انجام نشد."));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="dashboard-hint">در حال دریافت گفتگوها…</p>;
  }

  return (
    <>
      <div className="dashboard-chat">
        <div className="dashboard-chat-list">
          {!isAdmin && (
            <div className="p-3">
              <button
                type="button"
                className="primary-button w-full"
                onClick={() => setCreating(true)}
              >
                <FiPlus aria-hidden="true" /> گفتگوی جدید
              </button>
            </div>
          )}

          {items.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveId(conversation.id)}
              className={
                conversation.id === activeId
                  ? "dashboard-chat-item is-on"
                  : "dashboard-chat-item"
              }
            >
              <span className="dashboard-cell-main">
                {conversation.subject}
              </span>
              <span className="dashboard-cell-sub">
                {isAdmin && conversation.user ? `${conversation.user} · ` : ""}
                {conversation.updated_at}
              </span>
              <span className="mt-2 inline-block">
                <StatusBadge kind="conversation" value={conversation.status} />
              </span>
            </button>
          ))}
        </div>

        {active ? (
          <div className="dashboard-chat-pane">
            <div className="dashboard-chat-head">
              <div className="min-w-0">
                <p className="truncate font-black">{active.subject}</p>
                {isAdmin && <p className="dashboard-cell-sub">{active.user}</p>}
              </div>

              {isAdmin && active.status === "OPEN" && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={close}
                  disabled={busy}
                >
                  <FiLock aria-hidden="true" /> بستن گفتگو
                </button>
              )}
            </div>

            <div className="dashboard-chat-body">
              {(active.messages ?? []).map((message) => (
                <div
                  key={message.id}
                  className={
                    message.from === (isAdmin ? "ADMIN" : "USER")
                      ? "dashboard-bubble dashboard-bubble--mine"
                      : "dashboard-bubble"
                  }
                >
                  {message.text}
                  <span className="dashboard-bubble-time">{message.time}</span>
                </div>
              ))}
            </div>

            {active.status === "CLOSED" ? (
              <p className="dashboard-chat-foot dashboard-hint">
                این گفتگو بسته شده و امکان ارسال پیام جدید وجود ندارد.
              </p>
            ) : (
              <form className="dashboard-chat-foot" onSubmit={send}>
                <input
                  className="dashboard-input"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="پیام خود را بنویسید…"
                  aria-label="متن پیام"
                  disabled={busy}
                />
                <button
                  type="submit"
                  className="primary-button"
                  aria-label="ارسال"
                  disabled={busy || !text.trim()}
                >
                  <FiSend aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        ) : (
          <EmptyState
            title="گفتگویی انتخاب نشده"
            text={
              items.length
                ? "یک گفتگو را از فهرست انتخاب کنید."
                : "هنوز گفتگویی ثبت نشده است."
            }
          />
        )}
      </div>

      {creating && (
        <Modal
          title="گفتگوی جدید"
          onClose={() => !busy && setCreating(false)}
          footer={
            <>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCreating(false)}
                disabled={busy}
              >
                انصراف
              </button>
              <button
                type="submit"
                form="new-conversation"
                className="primary-button"
                disabled={busy}
              >
                {busy ? "در حال ارسال…" : "ارسال"}
              </button>
            </>
          }
        >
          <form
            id="new-conversation"
            className="dashboard-stack"
            onSubmit={create}
          >
            <div className="dashboard-field">
              <label htmlFor="conv-subject" className="dashboard-label">
                موضوع
              </label>
              <input
                id="conv-subject"
                className="dashboard-input"
                value={draft.subject}
                onChange={(event) =>
                  setDraft({ ...draft, subject: event.target.value })
                }
              />
            </div>

            <div className="dashboard-field">
              <label htmlFor="conv-text" className="dashboard-label">
                پیام
              </label>
              <textarea
                id="conv-text"
                rows={4}
                className="dashboard-input"
                value={draft.text}
                onChange={(event) =>
                  setDraft({ ...draft, text: event.target.value })
                }
              />
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
