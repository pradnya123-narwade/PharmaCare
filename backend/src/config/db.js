import mongoose from "mongoose";

export let lastDbError = null;

export function maskURI(uri) {
  if (!uri) return "NOT_SET";
  return uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
}

export function getDbDiagnostics() {
  const isCustomSet = Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim());
  const rawURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmacare_db";

  return {
    isConfiguredInEnv: isCustomSet,
    targetURI: isCustomSet ? maskURI(rawURI) : "mongodb://127.0.0.1:27017/pharmacare_db (Default: MONGODB_URI is MISSING in Render Environment Variables!)",
    lastError: lastDbError
  };
}

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmacare_db";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    lastDbError = null;
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    lastDbError = error.message;
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Note] Ensure MongoDB is running locally at ${mongoURI} or set MONGODB_URI in .env`);
    return null;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB connection lost / disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("[Database] MongoDB reconnected successfully");
  lastDbError = null;
});
