export default function Toast({ notification, onClose }) {
  if (!notification) return null;

  const isSuccess = notification.type === "success";
  const isError = notification.type === "error";

  return (
    <aside
      className={`toast-container ${isSuccess ? "toast-success" : isError ? "toast-error" : "toast-info"}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-icon">
        {isSuccess ? "✓" : isError ? "✕" : "ℹ"}
      </div>
      <div className="toast-message">
        <strong>{notification.title || (isSuccess ? "Success" : isError ? "Error" : "Notice")}</strong>
        <span>{notification.message}</span>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </aside>
  );
}
