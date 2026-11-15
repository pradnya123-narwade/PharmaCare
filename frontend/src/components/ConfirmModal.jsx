export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="presentation">
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon-wrap">
          <span className="modal-alert-icon">!</span>
        </div>
        <div className="modal-body">
          <h3 id="modal-title">{title}</h3>
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="button button-light"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
