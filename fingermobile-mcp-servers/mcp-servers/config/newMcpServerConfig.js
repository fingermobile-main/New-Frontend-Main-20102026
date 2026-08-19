/* global module, process, require */

const dotenv = require("dotenv");
dotenv.config();

/**
 * Configuration for the new MCP Server
 */

module.exports = {
  // Server configuration,
server: {port: process.env.NEW_MCP_SERVER_PORT || 4000,
  host: process.env.NEW_MCP_SERVER_HOST || "localhost",
  environment: process.env.NODE_ENV || "development"
  },

  // Security configuration,
security: {jwtSecret: process.env.NEW_MCP_JWT_SECRET || "new-mcp-server-secret-key",
  jwtExpiration: process.env.NEW_MCP_JWT_EXPIRATION || "24h"
  },

  // Database configuration,
database: {host: process.env.NEW_MCP_DB_HOST || "localhost",
  port: process.env.NEW_MCP_DB_PORT || 5432,
  name: process.env.NEW_MCP_DB_NAME || "new_mcp_server_db",
  membername: process.env.NEW_MCP_DB_membername || "postgres",
  password: process.env.NEW_MCP_DB_PASSWORD || "postgres"
  },

  // Service integrations,
services: {
    // Add service integrations here as needed
  }
};
