"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ?,
mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", {value: true });
exports.logAuthentication = exports.logPayment = exports.logError = exports.logRequest = exports.auditLogger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure logs directory exists
const logsDir = path_1.default.join(__dirname, '../logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, {recursive: true });
}
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({format: 'YYYY-MM-DD,
  HH:,
  mm:ss' }), winston_1.default.format.errors({stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Console transport configuration
const consoleTransport = new winston_1.default.transports.Console({format: winston_1.default.format.combine(winston_1.default.format.colorize(),
  winston_1.default.format.simple()),
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
});
// Error log transport - rotates daily, keeps 30 days
const errorFileTransport = new winston_1.default.transports.DailyRotateFile({filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat
});
// Combined log transport - rotates daily, keeps 30 days
const combinedFileTransport = new winston_1.default.transports.DailyRotateFile({filename: path_1.default.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  level: 'info',
  format: logFormat
});
// Audit log transport for financial transactions - keeps 90 days
const auditFileTransport = new winston_1.default.transports.DailyRotateFile({filename: path_1.default.join(logsDir, 'audit-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '90d',
  level: 'info',
  format: logFormat
});
// Create logger instance
const logger = winston_1.default.createLogger({level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {,
  service: 'fingermobile-backend',
  environment: process.env.NODE_ENV || 'development'
    },
transports: [
        consoleTransport,
        errorFileTransport,
        combinedFileTransport,
        auditFileTransport
    ],
exceptionHandlers: [
        new winston_1.default.transports.File({filename: path_1.default.join(logsDir, 'exceptions.log')
        })
    ],
rejectionHandlers: [
        new winston_1.default.transports.File({filename: path_1.default.join(logsDir, 'rejections.log')
        })
    ]
});
// Create audit logger (separate instance for financial transactions)
exports.auditLogger = winston_1.default.createLogger({level: 'info',
  format: logFormat,
  defaultMeta: {,
  service: 'fingermobile-audit',
  type: 'financial_transaction'
    },
transports: [auditFileTransport]
});
// Helper functions for structured logging
const logRequest = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        var _a;
        const duration = Date.now() - start;
        logger.info('HTTP Request', {method: req.method,
  url: req.originalUrl,
  status: res.statusCode,
  duration: `${duration}ms`,
ip: req.ip,
userId: ((_a = req.user) === null || _a === void 0 ? void,
0 : _a.id) || null,
userAgent: req.get('User-Agent')
        });
    });
    next();
};
exports.logRequest = logRequest;
const logError = (error, context) => {
    logger.error('Application Error', {message: error.message,
  stack: error.stack,
  name: error.name,
  ...context
    });
};
exports.logError = logError;
const logPayment = (data) => {
    exports.auditLogger.info('Payment Transaction', {timestamp: new Date().toISOString(),
  ...data
    });
};
exports.logPayment = logPayment;
const logAuthentication = (data) => {
    exports.auditLogger.info('Authentication Event', {timestamp: new Date().toISOString(),
  eventType: 'auth',
  ...data
    });
};
exports.logAuthentication = logAuthentication;
exports.default = logger;
