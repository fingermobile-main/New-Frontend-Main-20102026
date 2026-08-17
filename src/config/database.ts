import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "fingermobile_platform_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  ssl: process.env.DB_SSL === "true" ? true : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the database connection
pool.query("SELECT NOW()", (
  err: Error | null,
  _res: unknown) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.info("Database connected successfully");
  }
});

// Handle pool errors
pool.on("error", (
  err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

process.on("SIGINT", () => {
  pool.end(() => {
    console.info("Database connection pool closed due to app termination");
    process.exit(0);
  });
});

export default pool;
