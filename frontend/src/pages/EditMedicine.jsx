import { useNavigate, useParams, Link } from "react-router-dom";
import MedicineForm from "../components/MedicineForm";

export default function EditMedicine({ medicines, onUpdate, apiConnected }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const medicine = medicines.find((item) => item.id === id || item._id === id);

  // Conditional rendering: when medicine ID is not found in inventory
  if (!medicine) {
    return (
      <section className="page-content">
        <div className="panel empty-state">
          <div className="empty-icon">⚠️</div>
          <h2>Medicine Record Not Found</h2>
          <p>The medicine ID <code>{id}</code> does not exist in the current pharmacy database.</p>
          <div style={{ marginTop: "18px" }}>
            <Link to="/inventory" className="button button-primary">
              Return to Medicine Inventory
            </Link>
          </div>
        </div>
      </section>
    );
  }

  async function handleSave(values) {
    try {
      await onUpdate(id, values);
      navigate("/inventory");
    } catch (err) {
      console.error("Failed to update medicine:", err);
    }
  }

  function handleCancel() {
    navigate("/inventory");
  }

  return (
    <section className="page-content">
      <div className="form-page-layout">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <div className="eyebrow">UPDATE RECORD</div>
              <h2>Edit Medicine: {medicine.name}</h2>
              <p>Modify stock quantity, retail price, or batch expiration date for item code <code>{medicine.id}</code>.</p>
            </div>
            <Link to="/inventory" className="text-link">
              ← Cancel &amp; Back to Inventory
            </Link>
          </div>

          {/* Reusable Data-Entry Form in edit mode */}
          <MedicineForm
            editingMedicine={medicine}
            onSave={handleSave}
            onCancelEdit={handleCancel}
          />
        </section>

        {/* Audit Info Sidebar */}
        <aside className="panel help-panel">
          <h3>Record Metadata</h3>
          <dl className="meta-list">
            <div>
              <dt>Item Code:</dt>
              <dd><code>{medicine.id}</code></dd>
            </div>
            <div>
              <dt>Original Name:</dt>
              <dd>{medicine.name}</dd>
            </div>
            <div>
              <dt>Current Category:</dt>
              <dd>{medicine.category}</dd>
            </div>
            <div>
              <dt>Current Stock:</dt>
              <dd>{medicine.quantity} units</dd>
            </div>
          </dl>

          <div className="quick-tip-card">
            <span className="tip-badge">NOTE</span>
            <p>Editing updates localStorage immediately. Keep batch records and shelf tags synchronized.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
