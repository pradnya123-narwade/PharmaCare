export function getMedicineStatus(quantity) {
  const qty = Number(quantity);
  if (qty <= 0) return "Out of Stock";
  if (qty <= 10) return "Low Stock";
  return "Available";
}

export function getExpiryStatus(expiryDate) {
  if (!expiryDate) return "Normal";
  const today = new Date().toISOString().slice(0, 10);
  if (expiryDate < today) return "Expired";

  const todayMs = new Date(today).getTime();
  const expMs = new Date(expiryDate).getTime();
  const diffDays = Math.ceil((expMs - todayMs) / (1000 * 60 * 60 * 24));
  if (diffDays <= 30) return "Expiring Soon";

  return "Normal";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
}
