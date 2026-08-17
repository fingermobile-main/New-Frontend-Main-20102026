import React, {} from 'react';
export enum ErrorType {
  API_ERROR = 'API_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface LogError {
  type: ErrorType;
  message: string;
  stack?: string;
  timestamp: Date;
  meta?: Record<string, unknown>;
}

const clientErrors: Array<LogError> = [];

export const logError = (
  error: unknown, 
  typeOrMeta?: ErrorType | {
    context: string; error?: any; postId?: string; userId?: string; [
    key: string]: unknown },
  meta?: Record<string, unknown>
): void => {
  let errorType: ErrorType = ErrorType.UNKNOWN_ERROR;
  let errorMeta: Record<string, unknown> = meta || {};
  
  if (typeOrMeta) {
    if (typeof typeOrMeta === 'string') {
      // Check if it's a valid ErrorType
      if (Object.values(ErrorType).includes(typeOrMeta as ErrorType)) {
        errorType = typeOrMeta as ErrorType;
      } else {
        // Otherwise treat it as context in meta
        errorMeta = { ...errorMeta, context: typeOrMeta };
      }
    } else if (typeOrMeta && typeof typeOrMeta === 'object') {
      // It's an object with context and other metadata
      errorMeta = { ...errorMeta, ...typeOrMeta };
    } else if (typeOrMeta) {
      // It's an ErrorType enum value
      errorType = typeOrMeta as ErrorType;
    }
  }
  
  const logEntry: LogError = {
    type: errorType,
    message: (error instanceof Error) ? error.message : String(error),
    stack: (error instanceof Error) ? error.stack : undefined,
    timestamp: new Date(),
    meta: errorMeta
  };

  clientErrors.push(logEntry);
};

export const getLoggedErrors = (): Array<LogError> => [...clientErrors];