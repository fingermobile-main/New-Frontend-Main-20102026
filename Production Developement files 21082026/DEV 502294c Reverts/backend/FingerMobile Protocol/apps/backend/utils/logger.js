const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({format: 'YYYY-MM-DD,
  HH:,
  mm:ss' }),
  winston.format.errors({stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create transports
const transports = [
  // Console logging
  new winston.transports.Console({format: winston.format.combine(
      winston.format.colorize(),
  winston.format.simple()
    )
  }),
  
  // Error log file
  new winston.transports.File({filename: path.join(__dirname, '../logs/error.log'),
  level: 'error',
  format: logFormat
  }),
  
  // Combined log file
  new winston.transports.File({filename: path.join(__dirname, '../logs/combined.log'),
  format: logFormat
  })
];

// Create logger instance
const logger = winston.createLogger({level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, {recursive: true });
}

module.exports = logger;
