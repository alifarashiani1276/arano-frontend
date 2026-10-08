import {
  FiCheckCircle,
  FiFolder,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";

const ICONS = {
  project: FiFolder,
  chat: FiMessageSquare,
  profile: FiUser,
  account: FiCheckCircle,
};

export default function HistoryList({ items }) {
  return (
    <ul className="dashboard-list">
      {items.map(({ id, icon, text, time }) => {
        const IconComp = ICONS[icon] ?? FiFolder;
        return (
          <li key={id} className="dashboard-list-item">
            <span className="dashboard-list-icon">
              <IconComp size={16} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm leading-7">{text}</p>
              <p className="dashboard-cell-sub">{time}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

