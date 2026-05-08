/**
 * Request Logger Middleware
 * Logs incoming requests with relevant information
 */

const requestLogger = (req, res, next) => {
  // Skip logging for health checks to reduce noise
  if (req.path === '/api/health') {
    return next();
  }

  const start = Date.now();

  // Capture original res.json
  const originalJson = res.json;

  // Override res.json to log response
  res.json = function(data) {
    const duration = Date.now() - start;
    
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Log based on environment
    if (process.env.NODE_ENV === 'development') {
      if (res.statusCode >= 400) {
        console.error('❌ Request Error:', logData);
      } else if (duration > 1000) {
        console.warn('⚠️  Slow Request:', logData);
      } else {
        console.log('✅ Request:', logData);
      }
    } else {
      // Production: more structured logging
      console.log(JSON.stringify(logData));
    }

    // Call original json function
    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
