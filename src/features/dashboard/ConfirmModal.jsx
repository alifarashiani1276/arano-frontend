import Modal from "./Modal";

export default function ConfirmModal({ title, text, confirmLabel = "تأیید", danger, onConfirm, onClose }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="secondary-button" onClick={onClose}>
            انصراف
          </button>
          <button
            type="button"
            className={danger ? "danger-button" : "primary-button"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm leading-7">{text}</p>
    </Modal>
  );
}
