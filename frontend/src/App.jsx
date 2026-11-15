import { useEffect, useState, useCallback } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { initialMedicines } from "./data/initialMedicines";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddMedicine from "./pages/AddMedicine";
import EditMedicine from "./pages/EditMedicine";
import {
  getMedicines,
  createMedicine as apiCreateMedicine,
  updateMedicine as apiUpdateMedicine,
  deleteMedicine as apiDeleteMedicine,
  checkHealth
} from "./services/api";

const STORAGE_KEY = "pharmacare-react-medicines";

export default function App() {
  // Medicines state: initialized from localStorage or initialMedicines as instant fallback
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return initialMedicines;
    } catch (e) {
      console.error("Failed to load initial cache", e);
      return initialMedicines;
    }
  });

  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // Helper to show notifications
  function showNotification(title, message, type = "success") {
    setNotification({ title, message, type });
  }

  // Load medicines from Express REST API
  const loadMedicinesFromApi = useCallback(async (isInitial = false) => {
    setIsConnecting(true);
    try {
      // First check health
      await checkHealth();
      const serverMedicines = await getMedicines();

      if (Array.isArray(serverMedicines)) {
        setMedicines(serverMedicines);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serverMedicines));
        setApiConnected(true);
      }
    } catch (err) {
      console.warn("[PharmaCare] Backend API unreachable, falling back to local storage:", err.message);
      setApiConnected(false);
      if (!isInitial) {
        showNotification(
          "Connection Notice",
          "Could not reach backend API. Operating with local cached data.",
          "info"
        );
      }
    } finally {
      setIsConnecting(false);
      setLoading(false);
    }
  }, []);

  // Fetch from backend on initial mount
  useEffect(() => {
    loadMedicinesFromApi(true);
  }, [loadMedicinesFromApi]);

  // Persist medicines state into localStorage as offline fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
    } catch (e) {
      console.error("Failed to save medicines to cache", e);
    }
  }, [medicines]);

  // Update browser tab title
  useEffect(() => {
    document.title = `PharmaCare (${medicines.length} Medicines) | Full-Stack Inventory`;
  }, [medicines.length]);

  // Auto-dismiss toast notifications with proper timer cleanup
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Handler: Add new medicine record (persists to backend database)
  async function addMedicine(values) {
    if (apiConnected) {
      try {
        const created = await apiCreateMedicine(values);
        setMedicines((current) => [created, ...current]);
        showNotification(
          "Medicine Added",
          `"${created.name}" was successfully persisted in the database.`,
          "success"
        );
        return created;
      } catch (err) {
        console.error("API error adding medicine:", err);
        showNotification("API Error", `Failed to save to database: ${err.message}`, "error");
        throw err;
      }
    } else {
      // Offline fallback
      const newId = `MED-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMedicine = { ...values, id: newId };
      setMedicines((current) => [newMedicine, ...current]);
      showNotification(
        "Saved Locally",
        `"${newMedicine.name}" saved in browser storage (offline mode).`,
        "success"
      );
      return newMedicine;
    }
  }

  // Handler: Update existing medicine record (persists to backend database)
  async function updateMedicine(id, values) {
    if (apiConnected) {
      try {
        const updated = await apiUpdateMedicine(id, values);
        setMedicines((current) =>
          current.map((item) => (item.id === id || item._id === id ? { ...item, ...updated } : item))
        );
        showNotification(
          "Medicine Updated",
          `Record ${id} ("${values.name}") has been updated in database.`,
          "success"
        );
        return updated;
      } catch (err) {
        console.error("API error updating medicine:", err);
        showNotification("API Error", `Failed to update in database: ${err.message}`, "error");
        throw err;
      }
    } else {
      // Offline fallback
      setMedicines((current) =>
        current.map((item) => (item.id === id ? { ...item, ...values } : item))
      );
      showNotification(
        "Updated Locally",
        `Record ${id} updated in local storage (offline mode).`,
        "success"
      );
    }
  }

  // Handler: Delete medicine record (persists to backend database)
  async function deleteMedicine(id, name) {
    if (apiConnected) {
      try {
        await apiDeleteMedicine(id);
        setMedicines((current) => current.filter((item) => item.id !== id && item._id !== id));
        showNotification(
          "Medicine Deleted",
          `"${name || id}" was permanently removed from database.`,
          "error"
        );
      } catch (err) {
        console.error("API error deleting medicine:", err);
        showNotification("API Error", `Failed to delete from database: ${err.message}`, "error");
        throw err;
      }
    } else {
      // Offline fallback
      setMedicines((current) => current.filter((item) => item.id !== id));
      showNotification(
        "Removed Locally",
        `"${name || id}" removed from local storage.`,
        "error"
      );
    }
  }

  // Programmatic navigation to edit page
  function startEdit(medicine) {
    navigate(`/edit/${medicine.id}`);
  }

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            notification={notification}
            onCloseNotification={() => setNotification(null)}
            apiConnected={apiConnected}
            isConnecting={isConnecting}
            onRetryConnection={() => loadMedicinesFromApi(false)}
          />
        }
      >
        <Route
          index
          element={
            loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <p>Connecting to PharmaCare database &amp; loading inventory...</p>
              </div>
            ) : (
              <Dashboard
                medicines={medicines}
                onEdit={startEdit}
                onDelete={deleteMedicine}
                onRefresh={() => loadMedicinesFromApi(false)}
                apiConnected={apiConnected}
              />
            )
          }
        />
        <Route
          path="inventory"
          element={
            loading ? (
              <div className="loading-container">
                <div className="spinner" />
                <p>Loading formulary registry from database...</p>
              </div>
            ) : (
              <Inventory
                medicines={medicines}
                onEdit={startEdit}
                onDelete={deleteMedicine}
                onRefresh={() => loadMedicinesFromApi(false)}
                apiConnected={apiConnected}
              />
            )
          }
        />
        <Route
          path="add"
          element={
            <AddMedicine
              onSave={addMedicine}
              apiConnected={apiConnected}
            />
          }
        />
        <Route
          path="edit/:id"
          element={
            <EditMedicine
              medicines={medicines}
              onUpdate={updateMedicine}
              apiConnected={apiConnected}
            />
          }
        />
        {/* Fallback 404 Route */}
        <Route
          path="*"
          element={
            <section className="page-content">
              <div className="panel empty-state">
                <div className="empty-icon">404</div>
                <h2>Page Not Found</h2>
                <p>The requested route does not exist in PharmaCare.</p>
                <div style={{ marginTop: "16px" }}>
                  <Link to="/" className="button button-primary">
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </section>
          }
        />
      </Route>
    </Routes>
  );
}
