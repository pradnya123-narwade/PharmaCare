# PharmaCare – Pharmacy Inventory Management System (React)

A modern, production-ready React application for Pharmacy Inventory Management built with **Vite**, **React 18**, and **React Router DOM v6**.

---

## 📋 Comprehensive Implementation Checklist

All requested technical requirements have been implemented and verified:

| Requirement | Implementation Details | Key Files |
| :--- | :--- | :--- |
| **Reusable Functional Components** | Modular functional components: `Sidebar`, `AppLayout`, `StatCard`, `MedicineForm`, `MedicineTable`, `Toast`, `ConfirmModal`. | `src/components/*` |
| **JSX** | Clean, semantic JSX structure with accessibility attributes (`role="status"`, `role="dialog"`, `aria-label`). | All `.jsx` files |
| **Props** | Data and callback passing: parent-to-child data delivery (`medicines`, `editingMedicine`, `notification`, `label`, `value`, `tone`) and child-to-parent callbacks (`onSave`, `onEdit`, `onDelete`, `onCancelEdit`, `onConfirm`, `onCancel`). | `src/App.jsx`, `src/components/*`, `src/pages/*` |
| **State (`useState`)** | - Medicine list state with localStorage sync<br>- Controlled form fields & inline field validation errors<br>- Live search term, category filter, stock level filter, and sorting order<br>- Notification toast state<br>- Delete confirmation modal target | `src/App.jsx`, `src/components/MedicineForm.jsx`, `src/pages/Inventory.jsx` |
| **Lifecycle & Side Effects (`useEffect`)** | - Syncing inventory changes to browser `localStorage`<br>- Updating dynamic tab title with medicine counts<br>- Auto-dismissing toast notifications with timer cleanup (`clearTimeout`)<br>- Populating/resetting form fields when `editingMedicine` changes | `src/App.jsx`, `src/components/MedicineForm.jsx` |
| **Data-Entry Form** | Controlled form for registering & modifying medicines with real-time validation for name, manufacturer, category, positive price, non-negative quantity, and future expiry dates. | `src/components/MedicineForm.jsx`, `src/pages/AddMedicine.jsx` |
| **Listing View** | Comprehensive inventory registry table showing Medicine Details, Item Code, Category, Unit Price, Stock Quantity, Expiry Date with warning tags, Status Pill, and Actions. Includes live search, multi-criteria filtering, and 7-way sorting. | `src/components/MedicineTable.jsx`, `src/pages/Inventory.jsx` |
| **Conditional Rendering** | - Empty state illustration when zero records match<br>- Form validation error alert banner & inline warnings<br>- Critical Out-of-Stock and Low-Stock alert banners on Dashboard<br>- Status pill styles (`Available`, `Low Stock`, `Out of Stock`)<br>- Expiry badges (`Expired`, `Expiring Soon`)<br>- Confirmation modal dialog rendering<br>- Active filters reset bar<br>- 404 Route Not Found fallback | Throughout components |
| **Event Handling** | - `onChange` for text inputs, numbers, dates, and dropdown selects<br>- `onSubmit` with `event.preventDefault()` on form submit<br>- `onClick` for Delete, Edit, Reset, Clear search, and Modal actions<br>- Keyboard accessibility & event propagation handling | Form & action handlers |
| **React Router Navigation** | - Route configuration with `BrowserRouter`, `Routes`, `Route`, and `<Outlet />`<br>- `NavLink` with active states in `Sidebar`<br>- `useNavigate` for programmatic redirection after save/update<br>- `useParams` for extracting `:id` on `/edit/:id`<br>- `useLocation` for dynamic topbar titles | `src/App.jsx`, `src/components/Sidebar.jsx`, `src/components/AppLayout.jsx` |

---

## 🚀 How to Run the Application

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Steps

1. Open a terminal in the project directory (`c:\pradnya\pharmacare-react-program2`).
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the displayed local development URL in your browser (typically `http://localhost:5173/`).

### Production Build
To verify and generate optimized production assets:
```bash
npm run build
```
The output will be created inside the `dist/` directory.

---

## 🗂️ Application Structure

```text
pharmacare-react-program2/
├── index.html                      # HTML template with Google Fonts
├── package.json                    # Project dependencies & build scripts
├── vite.config.js                  # Vite configuration with React plugin
├── src/
│   ├── main.jsx                    # Application entry point with BrowserRouter
│   ├── App.jsx                     # Master state, lifecycle hooks, and Route setup
│   ├── styles.css                  # Professional healthcare design system
│   ├── components/
│   │   ├── AppLayout.jsx           # Layout shell with dynamic Topbar & Footer
│   │   ├── Sidebar.jsx             # Sidebar navigation with active NavLinks
│   │   ├── MedicineForm.jsx        # Controlled data-entry form with validation
│   │   ├── MedicineTable.jsx       # Reusable inventory listing table
│   │   ├── StatCard.jsx            # KPI metric card for Dashboard
│   │   ├── ConfirmModal.jsx        # Accessible deletion confirmation dialog
│   │   └── Toast.jsx               # Floating toast notifications with auto-dismiss
│   ├── pages/
│   │   ├── Dashboard.jsx           # KPI metrics, stock alerts & recent medicines
│   │   ├── Inventory.jsx           # Full listing with live search, filters & sort
│   │   ├── AddMedicine.jsx         # New medicine data intake screen
│   │   └── EditMedicine.jsx        # Medicine record modification screen
│   ├── data/
│   │   └── initialMedicines.js     # Default pharmaceutical sample dataset
│   └── utils/
│       └── medicine.js             # Currency formatting & stock/expiry status helpers
```

---

## 💡 Key Features

1. **Live Search & Multi-filter**:
   - Filter by medicine name, manufacturer brand, or ID.
   - Filter by dosage category (Tablet, Capsule, Syrup, Injection, Cream, Ointment, Drops).
   - Filter by stock availability (Available, Low Stock, Out of Stock).
   - Sort by Name (A-Z / Z-A), Price (Low-High / High-Low), Quantity, and Expiry Date.

2. **Smart Stock & Expiry Indicators**:
   - Automatic classification into **Available** (>10 units), **Low Stock** (1-10 units), and **Out of Stock** (0 units).
   - Real-time date comparison highlighting **Expired** or **Expiring Soon** (within 30 days) batches.

3. **Safe Deletion & Feedback**:
   - Reusable modal dialog prevents accidental deletions.
   - Toast notifications give instant feedback on Create, Update, and Delete operations.
