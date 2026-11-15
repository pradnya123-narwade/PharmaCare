import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Medicine } from "../models/Medicine.js";
import { initialMedicines } from "../data/seedData.js";

dotenv.config();

async function runSeed() {
  console.log("[Seed Script] Initializing database seeding...");
  const conn = await connectDB();

  if (!conn) {
    console.error("[Seed Script] Aborting: Could not connect to database.");
    process.exit(1);
  }

  const isReset = process.argv.includes("--reset") || process.argv.includes("-r");

  try {
    const existingCount = await Medicine.countDocuments();
    console.log(`[Seed Script] Current medicines in DB: ${existingCount}`);

    if (existingCount > 0 && !isReset) {
      console.log("[Seed Script] Database already contains records. Pass --reset to wipe and reseed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    if (isReset) {
      console.log("[Seed Script] Clearing existing medicine records...");
      await Medicine.deleteMany({});
    }

    console.log(`[Seed Script] Inserting ${initialMedicines.length} initial medicine records...`);
    const inserted = await Medicine.insertMany(initialMedicines);
    console.log(`[Seed Script] Successfully seeded ${inserted.length} records!`);

    await mongoose.disconnect();
    console.log("[Seed Script] Database connection closed.");
    process.exit(0);
  } catch (err) {
    console.error(`[Seed Script Error] Seeding failed: ${err.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runSeed();
