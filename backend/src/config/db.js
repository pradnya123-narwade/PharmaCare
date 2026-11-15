import mongoose from "mongoose";

export async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmacare_db";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error(`[Database Note] Ensure MongoDB is running locally at ${mongoURI} or set MONGODB_URI in .env`);
    // Do not terminate process immediately so health check can report status
    return null;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB connection lost / disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("[Database] MongoDB reconnected successfully");
});
