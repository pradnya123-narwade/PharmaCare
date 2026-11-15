/**
 * PharmaCare API Client
 * Connects the React frontend to the Express.js + Database backend.
 */

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
export const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");

    let data = null;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text };
    }

    if (!response.ok) {
      const errorMessage =
        (data && (data.message || (Array.isArray(data.errors) ? data.errors.join(", ") : null))) ||
        `Request failed with status ${response.status} (${response.statusText})`;

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const netError = new Error(
        `Unable to reach backend server at ${API_BASE_URL}. Ensure the Express API is running.`
      );
      netError.isNetworkError = true;
      throw netError;
    }
    throw err;
  }
}

/**
 * Fetch all medicines with optional search, filter, and sorting queries
 */
export async function getMedicines(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.category && params.category !== "All Categories") {
    queryParams.append("category", params.category);
  }
  if (params.stockLevel && params.stockLevel !== "All Stock Levels") {
    queryParams.append("stockLevel", params.stockLevel);
  }
  if (params.sortBy && params.sortBy !== "default") {
    queryParams.append("sortBy", params.sortBy);
  }

  const queryString = queryParams.toString();
  const endpoint = `/medicines${queryString ? `?${queryString}` : ""}`;
  const res = await request(endpoint, { method: "GET" });
  return res.data || [];
}

/**
 * Fetch a single medicine by item ID or MongoDB _id
 */
export async function getMedicineById(id) {
  const res = await request(`/medicines/${encodeURIComponent(id)}`, { method: "GET" });
  return res.data;
}

/**
 * Register a new medicine record in the database
 */
export async function createMedicine(medicineData) {
  const res = await request("/medicines", {
    method: "POST",
    body: JSON.stringify(medicineData)
  });
  return res.data;
}

/**
 * Update an existing medicine record in the database
 */
export async function updateMedicine(id, medicineData) {
  const res = await request(`/medicines/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(medicineData)
  });
  return res.data;
}

/**
 * Delete a medicine record from the database
 */
export async function deleteMedicine(id) {
  const res = await request(`/medicines/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
  return res.data;
}

/**
 * Fetch dashboard overview statistics calculated by the server
 */
export async function getStats() {
  const res = await request("/stats", { method: "GET" });
  return res.data;
}

/**
 * Check backend health & database connectivity
 */
export async function checkHealth() {
  const res = await request("/health", { method: "GET" });
  if (!res || res.status !== "ok") {
    throw new Error("Backend did not return a valid health check status.");
  }
  return res;
}

/**
 * Seed database with initial formulary records
 */
export async function seedMedicines(force = false) {
  const res = await request(`/medicines/seed${force ? "?force=true" : ""}`, {
    method: "POST"
  });
  return res;
}
