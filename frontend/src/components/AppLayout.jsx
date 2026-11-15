import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "./Toast";

function getPageMetadata(pathname) {
  if (pathname === "/") {
    return {
      title: "Pharmacy Dashboard",
      eyebrow: "OVERVIEW & METRICS",
      subtitle: "Comprehensive summary of medicines, stock availability, and inventory valuation."
    };
  }
  if (pathname === "/inventory") {
    return {
      title: "Medicine Inventory",
      eyebrow: "LISTING & CONTROL",
      subtitle: "Browse, search, filter, edit and track stock levels across your entire formulary."
    };
  }
  if (pathname === "/add") {
    return {
      title: "Add New Medicine",
      eyebrow: "FORMULARY INTAKE",
      subtitle: "Register a new pharmaceutical product with unit price, stock count, and batch expiry."
    };
  }
  if (pathname.startsWith("/edit")) {
    return {
      title: "Edit Medicine Record",
      eyebrow: "RECORD MANAGEMENT",
      subtitle: "Update pricing, adjust stock numbers, or modify expiration dates."
    };
  }
  return {
    title: "PharmaCare System",
    eyebrow: "WORKSPACE",
    subtitle: "Pharmacy inventory management system."
  };
}

export default function AppLayout({
  notification,
  onCloseNotification,
  apiConnected = true,
  isConnecting = false,
  onRetryConnection
}) {
  const location = useLocation();
  const meta = getPageMetadata(location.pathname);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">{meta.eyebrow}</div>
            <h1>{meta.title}</h1>
            <p className="topbar-subtitle">{meta.subtitle}</p>
          </div>
          <div className="profile">
            {/* Live API / DB Status Indicator */}
            <div
              className={`api-status-pill ${
                isConnecting
                  ? "loading"
                  : apiConnected
                  ? "connected"
                  : "disconnected"
              }`}
              title={
                apiConnected
                  ? "Connected to Express.js REST API & Database"
                  : "Backend disconnected - operating in fallback mode"
              }
            >
              <span className="api-dot" />
              <span>
                {isConnecting
                  ? "Connecting API..."
                  : apiConnected
                  ? "API Live (MongoDB)"
                  : "Offline Mode"}
              </span>
            </div>

            <div className="profile-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </div>
            <div className="avatar">AD</div>
            <div>
              <strong>Administrator</strong>
              <span>Chief Pharmacist</span>
            </div>
          </div>
        </header>

        {/* Informative banner if backend is unreachable */}
        {!apiConnected && !isConnecting && (
          <div className="api-banner-offline" role="alert">
            <div>
              ⚠️ <strong>Backend API Unreachable:</strong> Running in local offline mode.
              Changes are saved to browser storage. Start Express server (<code>npm run dev:backend</code>) to persist to MongoDB.
            </div>
            {onRetryConnection && (
              <button
                type="button"
                className="button button-light"
                style={{ padding: "4px 12px", fontSize: "12px" }}
                onClick={onRetryConnection}
              >
                Retry API Connect
              </button>
            )}
          </div>
        )}

        <Toast notification={notification} onClose={onCloseNotification} />

        <Outlet />

        <footer className="footer">
          <div>
            <strong>PharmaCare Inventory Management</strong> — Full Stack React + Express + Database
          </div>
          <div className="footer-links">
            <span>React Frontend (Vercel) • Express.js REST API &amp; MongoDB (Render) • CORS &amp; .env Configured</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
