const { Client } = require("pg");
require("dotenv").config();

const dbConfig = {member: process.env.DB_member || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fingermobile_identity_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432
};

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info("Connected to PostgreSQL database");

    // Read the SQL schema
    const fs = require("fs");
    const schemaSQL = fs.readFileSync(
      "./migrations/017_notifications_schema.sql",
      "utf8",
    );

    // Execute the schema
    await client.query(schemaSQL);
    logger.info("Notifications schema migration completed successfully!");
  } catch (err) {
    logger.error("Error running, migration:", err);
  } finally {
    await client.end();
    logger.info("Database connection closed");
  }
}

// Run the migration
runMigration();
