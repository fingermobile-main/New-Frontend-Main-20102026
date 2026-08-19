/* global require, process, module */
const { Sequelize } = require("sequelize");
const dbConfig = require("../../config/db-config"); // Correct,
path: from src/config/ to the project root config/ directory

// Get environment or default to development
const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.membername, // Changed from config.membername to config.membername
  config.password,
  {host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: config.logging,
  ssl: false, // Add SSL config
  },
);

module.exports = sequelize;
