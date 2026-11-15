import { useEffect, useState } from "react";

const BLANK_FORM = {
  name: "",
  manufacturer: "",
  category: "",
  price: "",
  quantity: "",
  expiryDate: ""
};

export default function MedicineForm({ onSave, editingMedicine = null, onCancelEdit }) {
  const [form, setForm] = useState(BLANK_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync form state when editingMedicine prop changes (demonstrating useEffect with dependencies)
  useEffect(() => {
    if (editingMedicine) {
      setForm({
        name: editingMedicine.name || "",
        manufacturer: editingMedicine.manufacturer || "",
        category: editingMedicine.category || "",
        price: editingMedicine.price !== undefined ? String(editingMedicine.price) : "",
        quantity: editingMedicine.quantity !== undefined ? String(editingMedicine.quantity) : "",
        expiryDate: editingMedicine.expiryDate || ""
      });
    } else {
      setForm(BLANK_FORM);
    }
    setErrors({});
    setIsSubmitted(false);
  }, [editingMedicine]);

  // Form field change handler (event handling)
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // Validation function
  function validate() {
    const newErrors = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!form.name.trim()) {
      newErrors.name = "Medicine name is required.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Medicine name must be at least 2 characters.";
    }

    if (!form.manufacturer.trim()) {
      newErrors.manufacturer = "Manufacturer name is required.";
    }

    if (!form.category) {
      newErrors.category = "Please select a category.";
    }

    if (form.price === "" || form.price === null) {
      newErrors.price = "Price per unit is required.";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than ₹0.00.";
    }

    if (form.quantity === "" || form.quantity === null) {
      newErrors.quantity = "Stock quantity is required.";
    } else if (Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) {
      newErrors.quantity = "Quantity must be 0 or a positive whole number.";
    }

    if (!form.expiryDate) {
      newErrors.expiryDate = "Expiry date is required.";
    } else if (!editingMedicine && form.expiryDate < today) {
      newErrors.expiryDate = "Expiry date must be today or a future date.";
    }

    return newErrors;
  }

  // Submit handler (event handling)
  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Call onSave prop with sanitized data
    onSave({
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      category: form.category,
      price: parseFloat(Number(form.price).toFixed(2)),
      quantity: parseInt(form.quantity, 10),
      expiryDate: form.expiryDate
    });

    if (!editingMedicine) {
      setForm(BLANK_FORM);
      setIsSubmitted(false);
      setErrors({});
    }
  }

  // Reset form handler (event handling)
  function handleReset() {
    if (editingMedicine) {
      setForm({
        name: editingMedicine.name || "",
        manufacturer: editingMedicine.manufacturer || "",
        category: editingMedicine.category || "",
        price: editingMedicine.price !== undefined ? String(editingMedicine.price) : "",
        quantity: editingMedicine.quantity !== undefined ? String(editingMedicine.quantity) : "",
        expiryDate: editingMedicine.expiryDate || ""
      });
    } else {
      setForm(BLANK_FORM);
    }
    setErrors({});
    setIsSubmitted(false);
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form className="medicine-form" onSubmit={handleSubmit} noValidate>
      {/* Conditional rendering for editing badge */}
      {editingMedicine && (
        <div className="form-info-banner">
          <span>Editing Record ID: <strong>{editingMedicine.id}</strong></span>
          <span className="info-tag">Active Edit Mode</span>
        </div>
      )}

      {/* Conditional rendering for general validation alert */}
      {isSubmitted && hasErrors && (
        <div className="form-error-banner" role="alert">
          <strong>Please fix the errors below:</strong>
          <ul>
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-grid">
        {/* Medicine Name */}
        <div className={`form-group ${errors.name ? "has-error" : ""}`}>
          <label htmlFor="name">
            Medicine Name <span className="req">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Paracetamol 650mg"
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <span className="field-error-msg">{errors.name}</span>}
        </div>

        {/* Manufacturer */}
        <div className={`form-group ${errors.manufacturer ? "has-error" : ""}`}>
          <label htmlFor="manufacturer">
            Manufacturer / Brand <span className="req">*</span>
          </label>
          <input
            id="manufacturer"
            name="manufacturer"
            type="text"
            value={form.manufacturer}
            onChange={handleChange}
            placeholder="e.g. Cipla Ltd."
            className={errors.manufacturer ? "input-error" : ""}
          />
          {errors.manufacturer && <span className="field-error-msg">{errors.manufacturer}</span>}
        </div>

        {/* Category */}
        <div className={`form-group ${errors.category ? "has-error" : ""}`}>
          <label htmlFor="category">
            Dosage Form / Category <span className="req">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? "input-error" : ""}
          >
            <option value="">Select category...</option>
            <option value="Tablet">Tablet</option>
            <option value="Capsule">Capsule</option>
            <option value="Syrup">Syrup</option>
            <option value="Injection">Injection</option>
            <option value="Cream">Cream</option>
            <option value="Ointment">Ointment</option>
            <option value="Drops">Drops</option>
          </select>
          {errors.category && <span className="field-error-msg">{errors.category}</span>}
        </div>

        {/* Price */}
        <div className={`form-group ${errors.price ? "has-error" : ""}`}>
          <label htmlFor="price">
            Unit Price (₹ INR) <span className="req">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. 25.50"
            className={errors.price ? "input-error" : ""}
          />
          {errors.price && <span className="field-error-msg">{errors.price}</span>}
        </div>

        {/* Quantity */}
        <div className={`form-group ${errors.quantity ? "has-error" : ""}`}>
          <label htmlFor="quantity">
            Stock Quantity (Units) <span className="req">*</span>
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 100"
            className={errors.quantity ? "input-error" : ""}
          />
          {errors.quantity && <span className="field-error-msg">{errors.quantity}</span>}
        </div>

        {/* Expiry Date */}
        <div className={`form-group ${errors.expiryDate ? "has-error" : ""}`}>
          <label htmlFor="expiryDate">
            Expiry Date <span className="req">*</span>
          </label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
            className={errors.expiryDate ? "input-error" : ""}
          />
          {errors.expiryDate && <span className="field-error-msg">{errors.expiryDate}</span>}
        </div>
      </div>

      <div className="form-actions">
        {/* Conditional rendering for Cancel button vs Reset button */}
        {editingMedicine && onCancelEdit && (
          <button
            type="button"
            className="button button-light"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}

        <button
          type="button"
          className="button button-secondary"
          onClick={handleReset}
        >
          {editingMedicine ? "Reset Changes" : "Clear Form"}
        </button>

        <button type="submit" className="button button-primary">
          {editingMedicine ? "Update Medicine Record" : "Save Medicine to Inventory"}
        </button>
      </div>
    </form>
  );
}
