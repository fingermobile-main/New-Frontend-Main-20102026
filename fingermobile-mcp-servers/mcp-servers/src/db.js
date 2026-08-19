/* global require, module, process */
const { Pool } = require("pg");
const dbConfig = require("../config/db-config");

// Determine the environment
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Create database pools
const identityDb = new Pool({member: config.membername,
  password: config.password,
  database: config.database,
  host: config.host,
  port: config.port,
  ssl: false, // Set to true if using SSL
});

const monetizationDb = new Pool({member: config.membername,
  password: config.password,
  database: config.database,
  host: config.host,
  port: config.port,
  ssl: false, // Set to true if using SSL
});

// Export the database pools
module.exports = {
  identityDb,
  monetizationDb,
  // You can add other database connections here as needed
};
