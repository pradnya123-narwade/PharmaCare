import { useNavigate, Link } from "react-router-dom";
import MedicineForm from "../components/MedicineForm";

export default function AddMedicine({ onSave }) {
  const navigate = useNavigate();

  function handleSave(values) {
    onSave(values);
    navigate("/inventory");
  }

  return (
    <section className="page-content">
      <div className="form-page-layout">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">FORMULARY INTAKE</div>
              <h2>Add New Medicine</h2>
              <p>Fill in the medicine specifications below to add a new item to pharmacy inventory.</p>
            </div>
            <Link to="/inventory" className="text-link">
              ← Back to Inventory
            </Link>
          </div>

          {/* Reusable Data-Entry Form */}
          <MedicineForm onSave={handleSave} />
        </section>

        {/* Informational Guidance Sidebar */}
        <aside className="panel help-panel">
          <h3>Formulary Guidelines</h3>
          <ul className="guidelines-list">
            <li>
              <strong>Item Code Auto-Generation:</strong> A unique pharmaceutical item ID (e.g. <code>MED-XXXXXXX</code>) will automatically be assigned on submission.
            </li>
            <li>
              <strong>Unit Price:</strong> Specify selling price in Indian Rupees (₹) per single strip, bottle, or vial.
            </li>
            <li>
              <strong>Stock Levels:</strong> Items with &le; 10 units are automatically tagged as <em>Low Stock</em>; items with 0 units are tagged as <em>Out of Stock</em>.
            </li>
            <li>
              <strong>Expiry Safeguard:</strong> Newly added medicines must have an expiry date equal to today or in the future.
            </li>
          </ul>

          <div className="quick-tip-card">
            <span className="tip-badge">TIP</span>
            <p>Ensure correct categorization (Tablets, Syrups, etc.) so inventory filters and reports stay accurate.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
