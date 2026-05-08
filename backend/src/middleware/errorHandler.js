/**
 * Error Handler Middleware
 * Centralized error handling for all Express routes
 */

class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Set default error values
  err.statusCode = err.statusCode || 500;
  err.errorCode = err.errorCode || 'SERVER_ERROR';

  // Handle validation errors
  if (err.statusCode === 422 || err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: Array.isArray(err.details) ? err.details : [{ message: err.message }]
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or malformed token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      }
    });
  }

  // Handle duplicate key errors
  if (err.code === 'ER_DUP_ENTRY' || (err.code === '23505' && err.detail)) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT',
        message: 'Resource already exists'
      }
    });
  }

  // Handle database errors
  if (err.name === 'SequelizeError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database operation failed'
      }
    });
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('\n❌ Error:', {
      message: err.message,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      stack: err.stack
    });
  }

  // Send error response
  return res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.errorCode,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
