import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊", code: "01", end: true },
  { to: "/inventory", label: "Medicine Inventory", icon: "💊", code: "02" },
  { to: "/add", label: "Add Medicine", icon: "➕", code: "03" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">P</div>
        <div className="brand-text">
          <h2>PharmaCare</h2>
          <span>Inventory Management</span>
        </div>
      </div>

      <div className="nav-caption">NAVIGATION</div>
      <nav className="side-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-code">{item.code}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-indicator-green" />
          <span>System Online • Local Storage</span>
        </div>
        <div className="system-info">
          <small>PHARMACARE DISPENSARY</small>
          <small>React 18 • Vite SPA</small>
        </div>
      </div>
    </aside>
  );
}
