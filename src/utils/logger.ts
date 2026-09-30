import React, {} from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
// Browser-compatible logger
// Uses console methods in browser, winston in Node.js

const isBrowser = typeof window !== 'undefined';

interface Logger {
  error(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  http(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
}

let logger: Logger;

if (isBrowser) {
  // Browser environment - use console-based logger
  const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  } as const;

  type LogLevel = keyof typeof LOG_LEVELS;

  const getEnvLogLevel = (): LogLevel => {
    return (process.env.LOG_LEVEL || 'info') as LogLevel;
  };

  const currentLevel = getEnvLogLevel();

  logger = {
    error: (message: string, ...meta: any[]) => {
      if (LOG_LEVELS.error <= LOG_LEVELS[currentLevel]) {
        console.error(`[ERROR] ${message}`, ...meta);
      }
    },

    warn: (message: string, ...meta: any[]) => {
      if (LOG_LEVELS.warn <= LOG_LEVELS[currentLevel]) {
        console.warn(`[WARN] ${message}`, ...meta);
      }
    },

    info: (message: string, ...meta: any[]) => {
      if (LOG_LEVELS.info <= LOG_LEVELS[currentLevel]) {
        console.info(`[INFO] ${message}`, ...meta);
      }
    },

    http: (message: string, ...meta: any[]) => {
      if (LOG_LEVELS.http <= LOG_LEVELS[currentLevel]) {
        console.log(`[HTTP] ${message}`, ...meta);
      }
    },

    debug: (message: string, ...meta: any[]) => {
      if (LOG_LEVELS.debug <= LOG_LEVELS[currentLevel]) {
        console.debug(`[DEBUG] ${message}`, ...meta);
      }
    }
  };
} else {
  // Use dynamic require calls scoped entirely away from browser evaluation passes
  /* eslint-disable @typescript-eslint/no-var-requires */
  const winston = require('winston');
  const path = require('path');
  const fs = require('fs');
  /* eslint-enable @typescript-eslint/no-var-requires */

  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  };

  winston.addColors(colors);

  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info: any) => `${info.timestamp} ${info.level}: ${info.message}`)
  );

  // Safely evaluate directory pathways relative to modern monorepos/build layers
  const logsDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      )
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'all.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ];

  const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  };

  const getEnvLogLevel = () => {
    return process.env.LOG_LEVEL || 'info';
  };

  logger = winston.createLogger({
    level: getEnvLogLevel(),
    levels: LOG_LEVELS,
    format,
    transports
  });
}

export default logger;
