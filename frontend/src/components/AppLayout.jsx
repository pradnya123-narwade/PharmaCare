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
  apiUrl = "",
  onRetryConnection
}) {
  const location = useLocation();
  const meta = getPageMetadata(location.pathname);

  const isVercel =
    typeof window !== "undefined" &&
    (window.location.hostname.includes("vercel.app") ||
      (!window.location.hostname.includes("localhost") &&
        !window.location.hostname.includes("127.0.0.1")));

  const isPointingToLocalhost =
    apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1") || apiUrl === "/api";

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
              {isVercel && isPointingToLocalhost ? (
                <>
                  ⚠️ <strong>Backend URL Not Configured on Vercel:</strong> Your frontend is deployed, but <code>VITE_API_BASE_URL</code> is pointing to localhost (<code>{apiUrl}</code>).
                  Go to <strong>Vercel Settings → Environment Variables</strong>, set <code>VITE_API_BASE_URL=https://&lt;your-render-backend&gt;.onrender.com/api</code>, and <strong>Redeploy</strong>.
                </>
              ) : isVercel ? (
                <>
                  ⏳ <strong>Connecting to Render Backend:</strong> Target URL: <code>{apiUrl}</code>. Free Render services sleep when idle and take ~40 seconds to spin up. Click <strong>Retry API Connect</strong> in a few moments.
                </>
              ) : (
                <>
                  ⚠️ <strong>Backend API Unreachable:</strong> Running in local offline mode (target: <code>{apiUrl}</code>).
                  Start the Express server (<code>npm run dev:backend</code>) and click <strong>Retry API Connect</strong>.
                </>
              )}
            </div>
            {onRetryConnection && (
              <button
                type="button"
                className="button button-light"
                style={{ padding: "6px 14px", fontSize: "12px", whiteSpace: "nowrap" }}
                onClick={onRetryConnection}
              >
                🔄 Retry API Connect
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
