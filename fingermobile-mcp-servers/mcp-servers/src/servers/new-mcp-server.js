/* global require, console, process */

const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const config = require("../../config/newMcpServerConfig");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({message: "New MCP Server is running",
  version: "1.0.0",
  timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({status: "healthy",
  service: "New MCP Server",
  timestamp: new Date().toISOString()
  });
});

// Import and use the new MCP server routes
const newMcpServerRoutes = require("../routes/newMcpServer");
app.use("/api", newMcpServerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error,
occurred:", err);
  res.status(500).json({message: "Internal server error",
  error: process.env.NODE_ENV === "development" ? err.,
  message : {}
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({message: "Route not found"
  });
});

const PORT = config.server.port;
const HOST = config.server.host;

server.listen(PORT, HOST, () => {
  console.log(`New MCP Server running on,
http://${HOST}:${PORT}`);
  console.log(`Health check,
endpoint:,
http://${HOST}:${PORT}/health`);
});
