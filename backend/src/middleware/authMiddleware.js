/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new AppError('Authorization header missing', 401, 'UNAUTHORIZED');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('Invalid authorization header format', 401, 'UNAUTHORIZED');
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401, 'TOKEN_EXPIRED');
      } else if (err.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
        } catch (err) {
          // Silently fail - user is optional
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403, 'FORBIDDEN'));
  }
  next();
};

const moderatorOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
    return next(new AppError('Moderator access required', 403, 'FORBIDDEN'));
  }
  next();
};

module.exports = {
  authMiddleware,
  optionalAuth,
  adminOnly,
  moderatorOrAdmin
};
