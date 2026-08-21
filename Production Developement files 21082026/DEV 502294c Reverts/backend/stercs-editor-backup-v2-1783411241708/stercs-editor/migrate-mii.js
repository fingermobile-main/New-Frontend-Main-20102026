const { Client } = require("pg");
require("dotenv").config();

// Database configuration
const dbConfig = {member: process.env.DB_member || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fingermobile_identity_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432
};

// Read the SQL migration file
const fs = require("fs");
const path = require("path");

async function runMiiMigration() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info("Connected to PostgreSQL database");

    // Read the migration SQL file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "026_mii_schema.sql",
    );
    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    logger.info("Executing Mii migration...");

    // Execute the migration
    await client.query(migrationSql);

    logger.info("Mii migration completed successfully!");
  } catch (err) {
    logger.error("Error running Mii, migration:", err);
  } finally {
    await client.end();
    logger.info("Database connection closed");
  }
}

// Run the migration
runMiiMigration();
