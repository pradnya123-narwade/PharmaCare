import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./src/config/db.js";
import medicineRoutes from "./src/routes/medicineRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { Medicine } from "./src/models/Medicine.js";
import { initialMedicines } from "./src/data/seedData.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Configure CORS
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

const envAllowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim().replace(/\/$/, ""))
  : [];

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow explicitly defined origins or any vercel.app preview domain
    const isAllowed =
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:");

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Warning] Blocked origin: ${origin}`);
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Request logging & body parsing
if (NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome & API info endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    name: "PharmaCare Inventory Management API",
    version: "1.0.0",
    status: "online",
    documentation: "/api/health",
    endpoints: {
      health: "GET /api/health",
      stats: "GET /api/stats",
      medicines: "GET /api/medicines",
      getMedicine: "GET /api/medicines/:id",
      addMedicine: "POST /api/medicines",
      updateMedicine: "PUT /api/medicines/:id",
      deleteMedicine: "DELETE /api/medicines/:id",
      seedMedicines: "POST /api/medicines/seed"
    }
  });
});

// System Health Check endpoint
app.get("/api/health", (req, res) => {
  const dbStateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  };
  const dbState = dbStateMap[mongoose.connection.readyState] || "unknown";

  res.status(200).json({
    status: "ok",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    database: {
      status: dbState,
      name: mongoose.connection.name || "pharmacare_db"
    }
  });
});

// API Routes
app.use("/api", medicineRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Connect DB and Start Server
async function startServer() {
  const dbConn = await connectDB();

  // Auto-seed if database is freshly created and empty
  if (dbConn) {
    try {
      const count = await Medicine.countDocuments();
      if (count === 0) {
        console.log("[Auto-Seed] Empty database detected. Seeding initial formulary records...");
        await Medicine.insertMany(initialMedicines);
        console.log(`[Auto-Seed] Successfully inserted ${initialMedicines.length} initial medicines.`);
      }
    } catch (seedErr) {
      console.warn(`[Auto-Seed Warning] Could not auto-seed: ${seedErr.message}`);
    }
  }

  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  PharmaCare Backend Server running in ${NODE_ENV} mode`);
    console.log(`  Port: ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Allowed Origins: ${allowedOrigins.join(", ")}`);
    console.log(`=======================================================`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n[Server Error] Port ${PORT} is already in use by another running process.`);
      console.error(`To free port ${PORT} on Windows, run:\n  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
    } else {
      console.error("[Server Error]", err);
    }
    process.exit(1);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n[Shutdown] Received ${signal}. Closing HTTP server & database connection...`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log("[Shutdown] MongoDB connection closed cleanly.");
        process.exit(0);
      } catch (err) {
        console.error("[Shutdown Error]", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer();

export default app;
