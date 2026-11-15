import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Link } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { initialMedicines } from "./data/initialMedicines";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddMedicine from "./pages/AddMedicine";
import EditMedicine from "./pages/EditMedicine";

const STORAGE_KEY = "pharmacare-react-medicines";

export default function App() {
  // State: Medicines list initialized from localStorage or default data
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
      console.error("Failed to load medicines from localStorage", e);
      return initialMedicines;
    }
  });

  // State: Notification toast
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // useEffect: Persist medicines state into localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
    } catch (e) {
      console.error("Failed to save medicines to localStorage", e);
    }
  }, [medicines]);

  // useEffect: Keep browser tab title up to date with active medicine count
  useEffect(() => {
    document.title = `PharmaCare (${medicines.length} Medicines) | React Inventory`;
  }, [medicines.length]);

  // useEffect: Auto-dismiss toast notifications with proper timer cleanup
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification]);

  // Helper to show notifications
  function showNotification(title, message, type = "success") {
    setNotification({ title, message, type });
  }

  // Event handler / Data modifier: Add new medicine record
  function addMedicine(values) {
    const newId = `MED-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMedicine = {
      ...values,
      id: newId
    };

    setMedicines((current) => [newMedicine, ...current]);
    showNotification("Medicine Added", `"${newMedicine.name}" was successfully added to inventory.`, "success");
  }

  // Event handler / Data modifier: Update existing medicine record
  function updateMedicine(id, values) {
    setMedicines((current) =>
      current.map((item) => (item.id === id ? { ...item, ...values } : item))
    );
    showNotification("Medicine Updated", `Record ${id} ("${values.name}") has been updated.`, "success");
  }

  // Event handler / Data modifier: Delete medicine record
  function deleteMedicine(id, name) {
    setMedicines((current) => current.filter((item) => item.id !== id));
    showNotification(
      "Medicine Deleted",
      `"${name || id}" was permanently removed from inventory.`,
      "error"
    );
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
          />
        }
      >
        <Route
          index
          element={
            <Dashboard
              medicines={medicines}
              onEdit={startEdit}
              onDelete={deleteMedicine}
            />
          }
        />
        <Route
          path="inventory"
          element={
            <Inventory
              medicines={medicines}
              onEdit={startEdit}
              onDelete={deleteMedicine}
            />
          }
        />
        <Route
          path="add"
          element={<AddMedicine onSave={addMedicine} />}
        />
        <Route
          path="edit/:id"
          element={
            <EditMedicine
              medicines={medicines}
              onUpdate={updateMedicine}
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
