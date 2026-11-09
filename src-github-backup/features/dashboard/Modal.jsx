import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="dashboard-modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="dashboard-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="dashboard-modal-head">
          <h2 className="font-black">{title}</h2>
          <button type="button" className="dashboard-icon-button" aria-label="بستن" onClick={onClose}>
            <FiX size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="dashboard-modal-body">{children}</div>
        {footer && <div className="dashboard-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
