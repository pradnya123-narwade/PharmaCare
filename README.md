# PharmaCare – Full-Stack Pharmacy Inventory Management System

A production-ready, full-stack pharmacy inventory and formulary management system featuring a **React 18** frontend decoupled from an **Express.js** REST API backend with persistent database storage (**MongoDB with Mongoose** and **PostgreSQL with Sequelize** ready), pre-configured for seamless deployment to **Vercel** (frontend) and **Render** (backend).

---

## 🏛 Architecture Overview

The application is structured as a two-tier full-stack system with strict separation of concerns:

```
c:\pradnya\Program 2\
├── backend/                       # Express.js REST API & Database Service
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # Mongoose connection & lifecycle events
│   │   │   └── postgres.js       # Sequelize PostgreSQL alternative connector
│   │   ├── controllers/
│   │   │   └── medicineController.js  # CRUD, filtering, stats & seeding handlers
│   │   ├── data/
│   │   │   └── seedData.js       # Initial pharmaceutical formulary dataset
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Centralized error & 404 handler
│   │   ├── models/
│   │   │   ├── Medicine.js       # Mongoose Schema with validation & virtuals
│   │   │   └── postgres/Medicine.js # Sequelize model definition
│   │   ├── routes/
│   │   │   └── medicineRoutes.js # Express router endpoints
│   │   └── scripts/
│   │       └── seed.js           # Standalone CLI seeder script
│   ├── .env                      # Local backend environment variables (git-ignored)
│   ├── .env.example              # Template for Render / production secrets
│   ├── package.json              # Backend dependencies (express, mongoose, cors, etc.)
│   ├── render.yaml               # Render Web Service Blueprint spec
│   └── server.js                 # Express server bootstrap, CORS & middlewares
│
├── frontend/                      # React 18 Single-Page Application (Vite)
│   ├── src/
│   │   ├── components/           # Reusable functional UI components
│   │   │   ├── AppLayout.jsx     # Shell with navigation, topbar & API status badge
│   │   │   ├── ConfirmModal.jsx  # Reusable deletion confirmation dialog
│   │   │   ├── MedicineForm.jsx  # Controlled formulary intake & edit form
│   │   │   ├── MedicineTable.jsx # Formulary listing table with status badges
│   │   │   ├── Sidebar.jsx       # Brand navigation menu with NavLink active states
│   │   │   ├── StatCard.jsx      # Summary metrics card with colored accents
│   │   │   └── Toast.jsx         # Auto-dismissing notification banner
│   │   ├── data/
│   │   │   └── initialMedicines.js # Local offline fallback records
│   │   ├── pages/
│   │   │   ├── AddMedicine.jsx   # Register new pharmaceutical item
│   │   │   ├── Dashboard.jsx     # Operational summary, KPIs & critical alerts
│   │   │   ├── EditMedicine.jsx  # Modify pricing, quantity & batch expiry
│   │   │   └── Inventory.jsx     # Full registry with search, filter & sort
│   │   ├── services/
│   │   │   └── api.js            # Modular API service client
│   │   ├── utils/
│   │   │   └── medicine.js       # Currency formatters & status helpers
│   │   ├── App.jsx               # Root router, API sync state & handlers
│   │   ├── main.jsx              # Application entry point
│   │   └── styles.css            # Responsive custom CSS styling
│   ├── .env                      # Local frontend environment variables (git-ignored)
│   ├── .env.example              # Template for Vercel production secrets
│   ├── index.html                # HTML5 root with meta tags & favicon
│   ├── package.json              # Frontend dependencies (react, react-router-dom, etc.)
│   ├── vercel.json               # Vercel SPA routing rewrite rules
│   └── vite.config.js            # Vite configuration with local API proxy
│
├── .gitignore                     # Global gitignore (ignores node_modules, .env, dist)
├── package.json                   # Root orchestrator scripts (concurrently dev, build)
├── render.yaml                    # Root Render deployment Blueprint
├── vercel.json                    # Root Vercel deployment configuration
└── README.md                      # Comprehensive system documentation
```

---

## ⚡ Key Highlights & Implementations

1. **Clean Separation of Frontend & Backend**: The existing React frontend has been preserved in `frontend/`, and decoupled from the backend in `backend/`. Both have independent dependencies, scripts, and deployment configurations.
2. **Database Persistence**:
   - Primary: **MongoDB with Mongoose** featuring automated schema validation, virtual attributes (`status`, `expiryStatus`), search indexing, and auto-seeding.
   - Alternative: **PostgreSQL with Sequelize** configuration and model provided in `backend/src/config/postgres.js` and `backend/src/models/postgres/Medicine.js`.
3. **CORS & Environment Variables**: Configured for multiple environments (local Vite on 5173, production Vercel domains, and customizable `CLIENT_URL` / `MONGODB_URI`).
4. **Resilient Frontend Integration**:
   - Fetches and synchronizes with the Express API on startup.
   - Live visual status badge in the topbar (`API Live (MongoDB)` vs `Offline Mode`).
   - Seamless offline fallback to browser cache if the backend is waking up or temporarily offline.
   - One-click **🔄 Sync / Refresh** buttons on Dashboard and Inventory.
5. **Deployment Ready**:
   - **Vercel** (`frontend/vercel.json` & root `vercel.json` with SPA routing rules).
   - **Render** (`backend/render.yaml` & root `render.yaml` with health-check endpoints).

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18, v20, or v22+)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a free cloud MongoDB Atlas cluster)

### 1. Install All Dependencies
Run from the root directory to install root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```
*(Or install manually: `cd backend && npm install`, then `cd ../frontend && npm install`, then `npm install` in root).*

### 2. Configure Environment Files
Both backend and frontend come pre-configured with local `.env` files:

- **Backend** (`backend/.env`):
  ```env
  PORT=5000
  NODE_ENV=development
  MONGODB_URI=mongodb://127.0.0.1:27017/pharmacare_db
  CLIENT_URL=http://localhost:5173,http://localhost:3000
  ```

- **Frontend** (`frontend/.env`):
  ```env
  VITE_API_BASE_URL=http://localhost:5000/api
  ```

### 3. Seed Initial Database Records (Optional)
The backend automatically seeds initial medicines if the database is empty on first boot. You can also run the seed command manually anytime:
```bash
# Seed records (safe: skips if already populated)
npm run seed

# Or wipe and reseed cleanly
npm run seed:reset
```

### 4. Start Full-Stack Application
To start both the Express backend and React Vite frontend concurrently:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)
- **Frontend App**: `http://localhost:5173`

You can also run them independently in separate terminals:
```bash
# Terminal 1: Backend only
npm run dev:backend

# Terminal 2: Frontend only
npm run dev:frontend
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api` (Local) or `https://<your-render-service>.onrender.com/api` (Production)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health check (database connection status, uptime, environment) |
| `GET` | `/stats` | Aggregated metrics (total medicines, units, low stock, out of stock, inventory valuation) |
| `GET` | `/medicines` | Retrieve list of medicines with search, category, stockLevel, and sorting |
| `GET` | `/medicines/:id` | Retrieve single medicine by item ID (`MED-1001`) or MongoDB `_id` |
| `POST` | `/medicines` | Create a new medicine record (auto-generates unique `MED-XXXX` if omitted) |
| `PUT` | `/medicines/:id` | Update an existing medicine record |
| `DELETE` | `/medicines/:id` | Delete a medicine record from the database |
| `POST` | `/medicines/seed` | Seed initial formulary items (pass `?force=true` to wipe and reseed) |

### Sample JSON Payloads

#### 1. Create Medicine (`POST /api/medicines`)
**Request Body**:
```json
{
  "name": "Amoxicillin & Clavulanate 625mg",
  "manufacturer": "Sun Pharma",
  "category": "Capsule",
  "price": 165.00,
  "quantity": 25,
  "expiryDate": "2027-09-10"
}
```
**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Medicine \"Amoxicillin & Clavulanate 625mg\" added successfully.",
  "data": {
    "id": "MED-4821",
    "name": "Amoxicillin & Clavulanate 625mg",
    "manufacturer": "Sun Pharma",
    "category": "Capsule",
    "price": 165,
    "quantity": 25,
    "expiryDate": "2027-09-10",
    "status": "Available",
    "expiryStatus": "Normal",
    "_id": "6af94e3b944666f1dcd5a6f6",
    "createdAt": "2026-11-15T06:16:27.449Z",
    "updatedAt": "2026-11-15T06:16:27.449Z"
  }
}
```

#### 2. Query Medicines with Filters (`GET /api/medicines?search=dolo&category=Tablet&sortBy=price-asc`)
**Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "total": 8,
  "data": [
    {
      "id": "MED-1001",
      "name": "Dolo 650 (Paracetamol)",
      "manufacturer": "Micro Labs Ltd.",
      "category": "Tablet",
      "price": 32.50,
      "quantity": 120,
      "expiryDate": "2028-06-30",
      "status": "Available",
      "expiryStatus": "Normal"
    }
  ]
}
```

---

## 🌐 Production Deployment Guide

### Part 1: Deploy Backend to Render

1. **Host Database on MongoDB Atlas** (Free Tier):
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free shared cluster (M0).
   - In *Network Access*, add `0.0.0.0/0` (allow access from anywhere, required for Render).
   - In *Database Access*, create a database user and password.
   - Click *Connect* → *Drivers (Node.js)* and copy your connection string:
     `mongodb+srv://<username>:<password>@cluster0.mongodb.net/pharmacare_db?retryWrites=true&w=majority`

2. **Deploy on Render**:
   - Sign up at [Render](https://render.com/).
   - Click **New +** → **Web Service** and connect your GitHub repository.
   - Configure settings:
     - **Name**: `pharmacare-backend`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
   - Under **Environment Variables**, add:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`
     - `CLIENT_URL`: `https://your-pharmacare-frontend.vercel.app` *(update once Vercel is deployed)*
   - Click **Deploy Web Service**.
   - Copy your Render backend URL: e.g. `https://pharmacare-backend.onrender.com`.

---

### Part 2: Deploy Frontend to Vercel

1. **Deploy on Vercel**:
   - Sign up at [Vercel](https://vercel.com/).
   - Click **Add New...** → **Project** and import your GitHub repository.
   - Configure project settings:
     - **Framework Preset**: `Vite`
     - **Root Directory**: Click *Edit* and select `frontend` (or leave at root if using root `vercel.json`).
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Under **Environment Variables**, add:
     - `VITE_API_BASE_URL`: `https://pharmacare-backend.onrender.com/api` *(your Render backend URL with `/api` path)*
   - Click **Deploy**.

2. **Connect the Two (CORS Sync)**:
   - Once Vercel finishes deploying, copy the frontend URL (e.g., `https://pharmacare-frontend.vercel.app`).
   - Go back to your Render Dashboard for `pharmacare-backend` → **Environment**.
   - Update `CLIENT_URL` to match your Vercel URL:
     `CLIENT_URL=https://pharmacare-frontend.vercel.app`
   - Render will automatically re-deploy with the new CORS origin allowed!

---

## 🗄 Using PostgreSQL with Sequelize (Alternative Option)

If you prefer using PostgreSQL instead of MongoDB:

1. Install Sequelize and pg in the backend:
   ```bash
   cd backend
   npm install sequelize pg pg-hstore
   ```
2. Update `backend/.env` with your PostgreSQL database credentials:
   ```env
   DATABASE_URL=postgres://postgres:password@localhost:5432/pharmacare_db
   ```
3. Use the ready-to-go Sequelize connector in [backend/src/config/postgres.js](file:///c:/pradnya/Program%202/backend/src/config/postgres.js) and the model in [backend/src/models/postgres/Medicine.js](file:///c:/pradnya/Program%202/backend/src/models/postgres/Medicine.js).

---

## 🧪 Verification & Testing Completed

- [x] Backend connects to MongoDB and handles connection events and errors gracefully.
- [x] Auto-seeding populates initial formulary records on first startup.
- [x] Full CRUD REST endpoints (`GET`, `POST`, `PUT`, `DELETE`, `/stats`, `/health`) tested and verified.
- [x] Vite development proxy (`/api` -> `http://localhost:5000`) tested and returning HTTP 200.
- [x] Frontend builds with zero errors (`npm run build` completed cleanly).
- [x] Live UI API status indicator tested with live backend and offline fallback.
- [x] SPA navigation rewrites configured in `vercel.json` for seamless client-side routing on page reloads.
- [x] Blueprint configuration in `render.yaml` ready for one-click deployment.
