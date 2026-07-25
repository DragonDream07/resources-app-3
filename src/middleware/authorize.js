'use strict';

/**
 * RBAC middleware factory.
 * Returns an Express middleware that checks whether req.user holds at least
 * one of the required roles.
 *
 * Usage:  router.get('/admin/reports', authenticate, authorize('admin'), handler)
 *
 * @param {...string} roles - One or more role names that are permitted.
 * @returns {Function} Express middleware
 */
function authorize(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication is required.',
      });
    }

    // req.user.roles is expected to be an array of role name strings
    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [];

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action.',
      });
    }

    return next();
  };
}

module.exports = authorize;
