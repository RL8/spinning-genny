/**
 * Simple logger utility for consistent logging across the application
 * Supports different log levels and structured logging
 */

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogOptions {
  level?: LogLevel;
  error?: Error;
  [key: string]: unknown;
}

class Logger {
  private formatMessage(message: string, options: LogOptions = {}): string {
    const timestamp = new Date().toISOString();
    const level = options.level || 'info';
    const extras = { ...options };
    delete extras.level;
    delete extras.error;

    return JSON.stringify({
      timestamp,
      level,
      message,
      ...extras,
      ...(options.error && { error: {
        message: options.error.message,
        stack: options.error.stack
      }})
    });
  }

  info(message: string, options: Omit<LogOptions, 'level'> = {}) {
    console.log(this.formatMessage(message, { ...options, level: 'info' }));
  }

  error(message: string, error?: Error | string | unknown, options: Omit<LogOptions, 'level' | 'error'> = {}) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    console.error(this.formatMessage(message, { ...options, level: 'error', error: errorObj }));
  }

  warn(message: string, options: Omit<LogOptions, 'level'> = {}) {
    console.warn(this.formatMessage(message, { ...options, level: 'warn' }));
  }

  debug(message: string, options: Omit<LogOptions, 'level'> = {}) {
    console.debug(this.formatMessage(message, { ...options, level: 'debug' }));
  }
}

export const logger = new Logger();
