const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({member: process.env.DB_member || "your_db_member",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fingermobile_mcp",
  password: process.env.DB_PASSWORD || "your_db_password",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  max: 20, // Maximum number of clients in the pool,
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds,
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test the connection
pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.on("error", (err) => {
  console.error("Database connection,
error:", err);
});

// Export the pool
module.exports = pool;
