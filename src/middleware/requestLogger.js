'use strict';

const morgan = require('morgan');
const winston = require('winston');

// ---------------------------------------------------------------------------
// Winston logger instance
// ---------------------------------------------------------------------------
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// ---------------------------------------------------------------------------
// Morgan write stream → Winston
// ---------------------------------------------------------------------------
const morganStream = {
  write(message) {
    // Morgan appends a newline; strip it before passing to Winston
    logger.http(message.trimEnd());
  },
};

// Use the 'combined' Apache format in production, 'dev' otherwise
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

/**
 * HTTP request logging middleware.
 * Pipes Morgan output into the shared Winston logger.
 */
const requestLogger = morgan(morganFormat, { stream: morganStream });

module.exports = { requestLogger, logger };
