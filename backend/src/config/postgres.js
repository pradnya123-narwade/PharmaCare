// Alternative PostgreSQL Configuration using Sequelize
// To use PostgreSQL instead of MongoDB:
// 1. Install sequelize & pg: npm install sequelize pg pg-hstore
// 2. Set DB_DIALECT=postgres and DATABASE_URL in your .env
import { Sequelize } from "sequelize";

let sequelize = null;

export function getPostgresConnection() {
  if (sequelize) return sequelize;

  const dbUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@127.0.0.1:5432/pharmacare_db";

  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: process.env.NODE_ENV === "production" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  });

  return sequelize;
}

export async function connectPostgres() {
  try {
    const conn = getPostgresConnection();
    await conn.authenticate();
    console.log("[Database] PostgreSQL connection established successfully.");
    return conn;
  } catch (error) {
    console.error("[Database Error] Unable to connect to PostgreSQL:", error.message);
    return null;
  }
}
