import React, {} from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4
import apiService from '../services/apiService';

export enum IntegrationLogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface IntegrationLog {
  level: IntegrationLogLevel;
  message: string;
  timestamp: Date;
  service: string;
  meta?: Record<string, unknown>;
  duration?: number;
  component?: string;
  status?: 'success' | 'error' | 'pending';
  details?: unknown;
  error?: Error | string | null;
  action?: string;
  // Adding fields needed for self health check
  id?: string;
  operation?: string;
}

const integrationLogs: Array<IntegrationLog> = [];

export const logIntegration = (
  message: string,
  level: IntegrationLogLevel = IntegrationLogLevel.INFO,
  service: string,
  meta?: Record<string, unknown>
): void => {
  const logEntry: IntegrationLog = {
    level,
    message,
    timestamp: new Date(),
    service,
    meta
  };

  integrationLogs.push(logEntry);
};

export const getIntegrationLogs = (): Array<IntegrationLog> => [...integrationLogs];

export const clearIntegrationLogs = (): void => {
  integrationLogs.length = 0;
};

export const getIntegrationLogsByService = (
  service: string): Array<IntegrationLog> =>
  integrationLogs.filter(log => log.service === service);

export const getIntegrationLogsByLevel = (
  level: IntegrationLogLevel): Array<IntegrationLog> =>
  integrationLogs.filter(log => log.level === level);

class IntegrationLogger {
  private logs: IntegrationLog[] = [];
  private logToServer = true;

  // Log an integration event
  public log(
    component: string,
    action: string,
    status: 'success' | 'error' | 'pending',
    details?: unknown,
    error?: string | null
  ): IntegrationLog {
    const startTime = Date.now();

    const logEntry: IntegrationLog = {
      component,
      action,
      status,
      timestamp: new Date(),
      details: details ?? null,
      error: error || undefined,
      duration: status === 'pending' ? 0 : Date.now() - startTime,
      level: IntegrationLogLevel.INFO,
      message: `${component} - ${action}`,
      service: component
    };

    // Add to local logs
    this.logs.push(logEntry);

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.info(  // eslint-disable-line no-console
        `[Integration Log] ${component} - ${action} - ${status}`,
        details ?? '',
        error ?? ''
      );
    }

    // Optionally send to server
    if (this.logToServer && status !== 'pending') {
      void this.sendLogToServer(logEntry);
    }

    return logEntry;
  }

  // Send log to server
  private async sendLogToServer(
    logEntry: IntegrationLog): Promise<void> {
    try {
      // In a real implementation, this would send logs to a monitoring service
      // For now, we'll just simulate this

      // If you want to actually store logs in your database, you could
      // implement:
      // await apiService.logIntegrationEvent(logEntry);

      // Actual implementation to send log to server
      // This is a placeholder implementation that uses fetch to send the log data
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          level: logEntry.level,
          message: logEntry.message,
          timestamp: logEntry.timestamp,
          service: logEntry.service,
          details: logEntry.details,
          error: logEntry.error
        })
      });

      if (!response.ok) {
        console.error('Failed to send log to server:', response.statusText); // eslint-disable-line no-console
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send log to server:', error);
    }
  }

  // Get all logs
  public getLogs(): IntegrationLog[] {
    return [...this.logs];
  }

  // Get logs for a specific component
  public getLogsForComponent(
    component: string): IntegrationLog[] {
    return this.logs.filter(log => log.component === component);
  }

  // Get logs by status
  public getLogsByStatus(
    status: 'success' | 'error' | 'pending'): IntegrationLog[] {
    return this.logs.filter(log => log.status === status);
  }

  // Clear logs
  public clearLogs(): void {
    this.logs = [];
  }

  // Enable or disable server logging
  public setServerLogging(
    enabled: boolean): void {
    this.logToServer = enabled;
  }

  // Verify database integration for a component
  public async verifyDatabaseIntegration(
    component: string,
    testData: unknown): Promise<boolean> {
    // Adding explicit type annotation for the API response
    type HealthCheckResponse = {
      success?: boolean;
      [key: string]: unknown; // Changed from 'any' to 'unknown'
    };

    const startTime = Date.now();
    const logEntry = this.log(
      component,
      'database_integration_check',
      'pending',
      { testData }
    );

    try {
      // Perform a test operation to verify database connectivity
      // Using the generic request method since testDatabaseConnection doesn't exist
      const result = await apiService.request('/health', {
        method: 'GET'
      }) as HealthCheckResponse;

      if (result.success) {
        // Update the log entry with actual duration
        logEntry.duration = Date.now() - startTime;
        logEntry.status = 'success';
        // Ensure logEntry.details is an object before spreading
        logEntry.details = {
          ...(typeof logEntry.details === 'object' && logEntry.details !== null ? logEntry.details : {}),
          result
        };

        // Update log to server
        if (this.logToServer) {
          void this.sendLogToServer(logEntry);
        }

        return true;
      } else {
        // Update the log entry
        logEntry.duration = Date.now() - startTime;
        logEntry.status = 'error';
        logEntry.error = 'Database connection test failed';
        // Ensure logEntry.details is an object before spreading
        logEntry.details = {
          ...(typeof logEntry.details === 'object' && logEntry.details !== null ? logEntry.details : {}),
          result
        };

        // Update log to server
        if (this.logToServer) {
          void this.sendLogToServer(logEntry);
        }

        return false;
      }
    } catch (error) {
      // Update error log entry
      logEntry.duration = Date.now() - startTime;
      logEntry.status = 'error';
      logEntry.error = error instanceof Error ?
        error : new Error(String(error));
      // Ensure logEntry.details is an object before spreading
      logEntry.details = {
        ...(typeof logEntry.details === 'object' && logEntry.details !== null ? logEntry.details : {}),
        error
      };

      // Add to logs
      this.logs.push(logEntry);

      // Update log to server
      if (this.logToServer) {
        void this.sendLogToServer(logEntry);
      }

      return false;
    }
  }

  /**
   * Performs a health check on the logging service itself
   */
  async performSelfHealthCheck(): Promise<boolean> {
    const startTime = Date.now();
    const logEntry: IntegrationLog = {
      id: uuidv4(),
      timestamp: new Date(), // Fixed: use Date object instead of string
      level: IntegrationLogLevel.INFO, // Fixed: use enum instead of string
      service: 'integration-logger',
      operation: 'self-health-check',
      status: 'pending',
      duration: 0,
      details: {},
      error: undefined,
      message: 'Self health check' // Added missing property
    };

    // Add to logs
    this.logs.push(logEntry);

    try {
      // Simple health check - verify we can write to logs array
      const testWrite = this.logs.length;

      // Update the log entry
      logEntry.duration = Date.now() - startTime;
      logEntry.status = 'success';
      logEntry.details = {
        ...(typeof logEntry.details === 'object' && logEntry.details !== null ? logEntry.details : {}),
        testWrite
      };

      // Update log to server
      if (this.logToServer) {
        void this.sendLogToServer(logEntry);
      }

      return true;
    } catch (error) {
      // Update error log entry
      logEntry.duration = Date.now() - startTime;
      logEntry.status = 'error';
      logEntry.error = error instanceof Error ?
        error : new Error(String(error));
      logEntry.details = {
        ...(typeof logEntry.details === 'object' && logEntry.details !== null ? logEntry.details : {}),
        error
      };

      // Update log to server
      if (this.logToServer) {
        void this.sendLogToServer(logEntry);
      }

      return false;
    }
  }

  // Get average response time for a component
  public getAverageResponseTime(
    component: string): number {
    const componentLogs = this.logs.filter(
      (log): log is IntegrationLog =>
        log.component === component &&
        typeof log.duration === 'number' &&
        log.duration > 0
    );

    if (componentLogs.length === 0) {
      return 0;
    }

    const totalDuration = componentLogs.reduce((sum, log) => sum + (log.duration || 0), 0); // Fixed: handle potentially undefined duration
    return totalDuration / componentLogs.length;
  }

  // Get error rate for a component
  public getErrorRate(
    component: string): number {
    const componentLogs = this.logs.filter(
      (log): log is IntegrationLog => log.component === component
    );

    if (componentLogs.length === 0) {
      return 0;
    }

    const errorCount = componentLogs.filter(log => log.status === 'error').length;
    return (errorCount / componentLogs.length) * 100;
  }
}

const integrationLogger = new IntegrationLogger();
export default integrationLogger;

// Fix for line 168 - handling spread types correctly
export const formatLogData = <T extends Record<string, unknown>>(
  data: T): T => {
  if (typeof data === 'object' && data !== null) {
    return { ...data } as T; // Properly handled spread
  }
  return data as T;
};

// Fix for line 181 - handling spread types correctly
export function mergeLogContext<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  baseContext: T,
  additionalContext: U
): T & U {
  if (typeof baseContext === 'object' && typeof additionalContext === 'object' && baseContext !== null && additionalContext !== null) {
    return { ...baseContext, ...additionalContext } as T & U;
  }
  // Handle case where one or both parameters might be null/undefined/primative
  if (baseContext && additionalContext) {
    return { ...baseContext, ...additionalContext } as T & U;
  } else if (baseContext) {
    return baseContext as T & U;
  } else if (additionalContext) {
    return additionalContext as T & U;
  } else {
    return {} as T & U;
  }
}

// Fix for line 195 - handling spread types correctly
export const extendLogMetadata = <T extends Record<string, unknown>, U extends Record<string, unknown>>(
  metadata: T,
  extra: U): T & U => {
  if (typeof metadata === 'object' && typeof extra === 'object') {
    return { ...metadata, ...extra } as T & U; // Properly handled spread
  }
  return (metadata || extra) as T & U;
};

// Fix for line 222 - handling potentially undefined log duration
export const logDuration = (
  log: { duration?: number }): number => {
  return log.duration ?? 0; // Safe access with fallback
};
