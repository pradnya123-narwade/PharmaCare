import { formatCurrency, getExpiryStatus, getMedicineStatus } from "../utils/medicine";

export default function MedicineTable({ medicines, onEdit, onDelete }) {
  // Conditional rendering: Empty state when no medicines match
  if (!medicines || medicines.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💊</div>
        <h3>No Medicines Found</h3>
        <p>No inventory records match the current filter criteria, or no medicines have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="medicine-table">
        <thead>
          <tr>
            <th>MEDICINE DETAILS</th>
            <th>ITEM CODE</th>
            <th>CATEGORY</th>
            <th>PRICE / UNIT</th>
            <th>STOCK QTY</th>
            <th>EXPIRY DATE</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => {
            const stockStatus = getMedicineStatus(medicine.quantity);
            const expiryStatus = getExpiryStatus(medicine.expiryDate);

            const stockClass = stockStatus.toLowerCase().replace(/\s+/g, "-");
            const isLowStock = stockStatus === "Low Stock";
            const isOutOfStock = stockStatus === "Out of Stock";

            return (
              <tr
                key={medicine.id}
                className={isOutOfStock ? "row-out-of-stock" : isLowStock ? "row-low-stock" : ""}
              >
                <td>
                  <div className="medicine-title">
                    <span className="med-name">{medicine.name}</span>
                    <span className="med-mfg">{medicine.manufacturer}</span>
                  </div>
                </td>
                <td>
                  <code className="item-code">{medicine.id}</code>
                </td>
                <td>
                  <span className="category-pill">{medicine.category}</span>
                </td>
                <td className="price-col">
                  <strong>{formatCurrency(medicine.price)}</strong>
                </td>
                <td>
                  <span className={`qty-indicator ${stockClass}`}>
                    {medicine.quantity} {medicine.quantity === 1 ? "unit" : "units"}
                  </span>
                </td>
                <td>
                  <div className="expiry-cell">
                    <span>{medicine.expiryDate}</span>
                    {/* Conditional rendering for expiry warning tags */}
                    {expiryStatus === "Expired" && (
                      <span className="tag-expired" title="This medicine is expired">
                        Expired
                      </span>
                    )}
                    {expiryStatus === "Expiring Soon" && (
                      <span className="tag-expiring" title="Expires in less than 30 days">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  {/* Conditional rendering of status badge */}
                  <span className={`status-pill status-${stockClass}`}>
                    <span className="status-dot" />
                    {stockStatus}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="small-button edit"
                      onClick={() => onEdit(medicine)}
                      title={`Edit ${medicine.name}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="small-button delete"
                      onClick={() => onDelete(medicine)}
                      title={`Delete ${medicine.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
