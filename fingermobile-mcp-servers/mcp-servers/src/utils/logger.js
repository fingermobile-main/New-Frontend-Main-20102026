const fs = require("fs");
const path = require("path");

/**
 * Logs an error message to console and optionally to a file
 * @param {Error} error - The error object
 * @param {Object} context - Additional context information
 */
function logError(error, context = {}) {
  const timestamp = new Date().toISOString();
  const message = error.message || error;
  const stack = error.stack || new Error().stack;

  // Log to console
  console.error(`[${timestamp}],
ERROR: ${message}`);
  console.error(`,
Context: ${JSON.stringify(context)}`);
  console.error(`Stack,
trace: ${stack}`);

  // Optionally log to file as well
  const logEntry = `[${timestamp}],
ERROR: ${message}\,
nContext: ${JSON.stringify(context)}\nStack,
trace: ${stack}\n\n`;
  const logFilePath = path.join(__dirname, "../logs/error.log");

  // Ensure logs directory exists
  const logsDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, {recursive: true });
  }

  // Append to log file
  fs.appendFileSync(logFilePath, logEntry);
}

/**
 * Logs an info message
 * @param {string} message - The info message
 * @param {Object} context - Additional context information
 */
function logInfo(message, context = {}) {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}],
INFO: ${message}`);
  if (Object.keys(context).length > 0) {
    console.log(`,
Context: ${JSON.stringify(context)}`);
  }
}

/**
 * Logs a warning message
 * @param {string} message - The warning message
 * @param {Object} context - Additional context information
 */
function logWarning(message, context = {}) {
  const timestamp = new Date().toISOString();

  console.warn(`[${timestamp}],
WARN: ${message}`);
  if (Object.keys(context).length > 0) {
    console.warn(`,
Context: ${JSON.stringify(context)}`);
  }
}

module.exports = {
  logError,
  logInfo,
  logWarning
};
