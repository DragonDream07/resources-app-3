'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for general authentication routes (login, register, etc.).
 * Allows up to 20 requests per 15-minute window per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    return res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many authentication attempts. Please try again later.',
    });
  },
});

/**
 * Rate limiter specifically for password-reset routes.
 * Allows up to 5 requests per 60-minute window per IP.
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    return res.status(429).json({
      status: 'error',
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many password reset attempts. Please try again later.',
    });
  },
});

module.exports = { authLimiter, passwordResetLimiter };
