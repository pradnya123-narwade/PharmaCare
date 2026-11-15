import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MedicineTable from "../components/MedicineTable";
import ConfirmModal from "../components/ConfirmModal";

export default function Inventory({ medicines, onEdit, onDelete, onRefresh, apiConnected }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [stockLevel, setStockLevel] = useState("All Stock Levels");
  const [sortBy, setSortBy] = useState("default");
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  // Derived filtered & sorted medicines using useMemo
  const filteredMedicines = useMemo(() => {
    let result = medicines.filter((medicine) => {
      const term = search.toLowerCase().trim();
      const matchesSearch =
        !term ||
        medicine.name.toLowerCase().includes(term) ||
        medicine.manufacturer.toLowerCase().includes(term) ||
        medicine.id.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Categories" || medicine.category === category;

      const qty = Number(medicine.quantity);
      const matchesStock =
        stockLevel === "All Stock Levels" ||
        (stockLevel === "Available" && qty > 10) ||
        (stockLevel === "Low Stock" && qty > 0 && qty <= 10) ||
        (stockLevel === "Out of Stock" && qty === 0);

      return matchesSearch && matchesCategory && matchesStock;
    });

    // Sort operations
    result = [...result].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "qty-asc") return Number(a.quantity) - Number(b.quantity);
      if (sortBy === "qty-desc") return Number(b.quantity) - Number(a.quantity);
      if (sortBy === "expiry-asc") return (a.expiryDate || "").localeCompare(b.expiryDate || "");
      return 0; // default order
    });

    return result;
  }, [medicines, search, category, stockLevel, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All Categories" ||
    stockLevel !== "All Stock Levels" ||
    sortBy !== "default";

  function handleResetFilters() {
    setSearch("");
    setCategory("All Categories");
    setStockLevel("All Stock Levels");
    setSortBy("default");
  }

  function handlePromptDelete(medicine) {
    setMedicineToDelete(medicine);
  }

  function handleConfirmDelete() {
    if (medicineToDelete) {
      onDelete(medicineToDelete.id, medicineToDelete.name);
      setMedicineToDelete(null);
    }
  }

  return (
    <section className="page-content">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <div className="eyebrow">FORMULARY RECORDS</div>
            <h2>Medicine Inventory Registry</h2>
            <p>Filter, search, organize, inspect and manage complete medicine stock details.</p>
          </div>
          <div className="panel-heading-right">
            <span className="record-count">
              Showing {filteredMedicines.length} of {medicines.length} Medicines
            </span>
            {onRefresh && (
              <button
                type="button"
                className="button button-light"
                onClick={onRefresh}
                title="Sync with database"
                style={{ padding: "8px 14px" }}
              >
                🔄 Sync
              </button>
            )}
            <Link to="/add" className="button button-primary">
              + Add Medicine
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="filter-row">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or manufacturer..."
              aria-label="Search medicines"
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch("")}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            {["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={stockLevel}
            onChange={(e) => setStockLevel(e.target.value)}
            aria-label="Filter by stock status"
          >
            <option>All Stock Levels</option>
            <option value="Available">Available (&gt;10 units)</option>
            <option value="Low Stock">Low Stock (1–10 units)</option>
            <option value="Out of Stock">Out of Stock (0 units)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort medicines"
          >
            <option value="default">Sort by: Default</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="qty-asc">Quantity: Low to High</option>
            <option value="qty-desc">Quantity: High to Low</option>
            <option value="expiry-asc">Expiry Date: Earliest First</option>
          </select>
        </div>

        {/* Conditional rendering for filter reset chip */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <span>Filters active:</span>
            {search && <span className="filter-chip">Query: &quot;{search}&quot;</span>}
            {category !== "All Categories" && <span className="filter-chip">Category: {category}</span>}
            {stockLevel !== "All Stock Levels" && <span className="filter-chip">Status: {stockLevel}</span>}
            {sortBy !== "default" && <span className="filter-chip">Sorted</span>}
            <button
              type="button"
              className="text-button-reset"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Reusable Listing Component */}
        <MedicineTable
          medicines={filteredMedicines}
          onEdit={onEdit}
          onDelete={handlePromptDelete}
        />

        <div className="table-footer">
          <span>Displaying <strong>{filteredMedicines.length}</strong> matching entries</span>
          <span>Click <em>Edit</em> to modify pricing &amp; quantity or <em>Delete</em> to remove an item.</span>
        </div>
      </section>

      {/* Reusable ConfirmModal for safe deletion */}
      <ConfirmModal
        isOpen={Boolean(medicineToDelete)}
        title="Confirm Medicine Deletion"
        message={`Are you sure you want to permanently delete "${medicineToDelete?.name}" (${medicineToDelete?.id})? This action cannot be undone.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMedicineToDelete(null)}
      />
    </section>
  );
}
