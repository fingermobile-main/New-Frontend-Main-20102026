const logger = require('../../utils/logger');
export enum ErrorType {
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export const logError = (error: Error | unknown, type: ErrorType, context?: string): void => {
  // eslint-disable-next-line no-console
  logger.error({
    timestamp: new Date().toISOString(),
    type,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context
  });
};
