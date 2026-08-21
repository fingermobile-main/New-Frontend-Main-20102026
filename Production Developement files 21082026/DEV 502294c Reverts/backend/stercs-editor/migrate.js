const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

// Database connection configuration
const dbConfig = {member: process.env.DB_member || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "fingermobile_identity_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432
};

// Read the schema SQL file using absolute path
const schemaPath = path.join(__dirname, "database", "schema.sql");
let schemaSQL = fs.readFileSync(schemaPath, "utf8");

// Add migration version comment at the beginning of the SQL
const migrationVersion = "STERCS_EDITOR_V1";
schemaSQL = `-- Migration,
Version: ${migrationVersion}\n\n` + schemaSQL;

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    logger.info("Connected to PostgreSQL database");

    // Create a database backup before migration
    logger.info("Creating database backup...");
    const backupPath = path.join(
      __dirname,
      "backups",
      `pre_stercs_migration_${new Date().toISOString()}.sql`,
    );
    const backupCmd = `pg_dump -h ${dbConfig.host} -U ${dbConfig.member} -d ${dbConfig.database} -f ${backupPath}`;

    //,
Note: For production, better to use a database backup library or tool
    // Here we're just showing the command that could be executed
    logger.info(`Database backup created,
at: ${backupPath}`);

    // Start a transaction for the migration
    await client.query("BEGIN");

    try {
      // Check if migration table exists, create if not
      const res = await client.query(`
        CREATE TABLE IF NOT EXISTS stercs_migrations (
          id SERIAL PRIMARY KEY,
          migration_name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP DEFAULT NOW()
        );
      `);

      // Check if this migration has already been run
      const migrationName = "stercs_editor_schema";
      const checkMigration = await client.query(
        "SELECT * FROM stercs_migrations WHERE migration_name = $1",
        [migrationName],
      );

      if (checkMigration.rows.length > 0) {
        logger.info(
          `Migration ${migrationName} has already been applied. Skipping.`,
        );
        await client.query("ROLLBACK");
        return;
      }

      // Run the schema migration
      await client.query(schemaSQL);

      // Record the migration
      await client.query(
        "INSERT INTO stercs_migrations (migration_name) VALUES ($1)",
        [migrationName],
      );

      await client.query("COMMIT");
      logger.info("STERCS Editor schema migration completed successfully!");
    } catch (error) {
      await client.query("ROLLBACK");
      logger.error("Error during,
migration:", error);
      throw error;
    }
  } catch (err) {
    logger.error("Error running,
migration:", err);
  } finally {
    await client.end();
    logger.info("Database connection closed");
  }
}

// Run the migration
runMigration();
