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

const logger: Logger = {
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

export default logger;
