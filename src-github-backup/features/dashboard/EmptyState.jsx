import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title, text, icon: IconComp = FiInbox, children }) {
  return (
    <div className="dashboard-empty">
      <span className="dashboard-empty-icon">
        <IconComp size={24} aria-hidden="true" />
      </span>
      <p className="font-black">{title}</p>
      {text && <p className="dashboard-subtitle max-w-sm">{text}</p>}
      {children}
    </div>
  );
}
