import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import MedicineTable from "../components/MedicineTable";
import { formatCurrency } from "../utils/medicine";

export default function Dashboard({ medicines, onEdit, onDelete, onRefresh, apiConnected }) {
  const totalMedicines = medicines.length;
  const totalUnits = medicines.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowStockCount = medicines.filter((item) => Number(item.quantity) > 0 && Number(item.quantity) <= 10).length;
  const outOfStockCount = medicines.filter((item) => Number(item.quantity) === 0).length;
  const inventoryValue = medicines.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  // Recent 5 medicines for overview
  const recentMedicines = medicines.slice(0, 5);

  return (
    <section className="page-content">
      {/* Top action row */}
      <div className="section-heading">
        <div>
          <div className="eyebrow">INVENTORY SUMMARY</div>
          <h2>Formulary &amp; Stock Operations</h2>
          <p>Real-time monitor of medicine stock levels, availability alerts, and financial valuation.</p>
        </div>
        <div className="heading-actions">
          {onRefresh && (
            <button
              type="button"
              className="button button-light"
              onClick={onRefresh}
              title="Sync latest inventory with database"
            >
              🔄 Refresh Data
            </button>
          )}
          <Link to="/inventory" className="button button-light">
            View All ({totalMedicines})
          </Link>
          <Link to="/add" className="button button-primary">
            + Add New Medicine
          </Link>
        </div>
      </div>

      {/* Conditional rendering of stock alerts */}
      {outOfStockCount > 0 && (
        <div className="alert-card alert-danger" role="alert">
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">
            <strong>Critical Stock Alert: {outOfStockCount} {outOfStockCount === 1 ? "medicine is" : "medicines are"} completely Out of Stock!</strong>
            <p>Immediate restock required to prevent patient prescription fulfillment disruption.</p>
          </div>
          <Link to="/inventory" className="alert-action-btn">
            Inspect Stock →
          </Link>
        </div>
      )}

      {lowStockCount > 0 && outOfStockCount === 0 && (
        <div className="alert-card alert-warning" role="alert">
          <div className="alert-icon">⚡</div>
          <div className="alert-body">
            <strong>Low Stock Notice: {lowStockCount} {lowStockCount === 1 ? "medicine is" : "medicines are"} running below threshold (≤10 units).</strong>
            <p>Consider placing purchase orders with distributors soon.</p>
          </div>
          <Link to="/inventory" className="alert-action-btn">
            View Low Stock →
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Medicines"
          value={totalMedicines}
          note="Active registered formulary lines"
          number="01"
          tone="blue"
        />
        <StatCard
          label="Available Units"
          value={totalUnits.toLocaleString("en-IN")}
          note="Total package units across all shelves"
          number="02"
          tone="purple"
        />
        <StatCard
          label="Attention Required"
          value={lowStockCount + outOfStockCount}
          note={`${outOfStockCount} out of stock • ${lowStockCount} low stock`}
          number="03"
          tone={outOfStockCount > 0 ? "orange" : "blue"}
        />
        <StatCard
          label="Total Inventory Value"
          value={formatCurrency(inventoryValue)}
          note="Calculated at unit purchase rate"
          number="04"
          tone="green"
        />
      </div>

      {/* Listing View: Recent Medicines */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">RECENT FORMULARY ENTRIES</div>
            <h2>Recent Medicine Records</h2>
            <p>Recently added or updated pharmaceutical stock items.</p>
          </div>
          <Link to="/inventory" className="text-link">
            Explore All Inventory Records ({totalMedicines}) →
          </Link>
        </div>

        {/* Reusable MedicineTable */}
        <MedicineTable
          medicines={recentMedicines}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </section>
    </section>
  );
}
