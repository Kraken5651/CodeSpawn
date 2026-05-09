/**
 * CodeSpawn Backend - Express Application Entry Point
 * Main server application with middleware setup and route configuration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

// Import routes
const apiRoutes = require('./routes');

// Import database
const db = require('./models');

const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

// Helmet helps secure Express apps by setting various HTTP headers
if (process.env.HELMET_ENABLED !== 'false') {
  app.use(helmet());
}

// CORS - Allow requests from frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'test'
});

if (process.env.RATE_LIMITING_ENABLED !== 'false') {
  app.use('/api/', limiter);
}

// ============================================================================
// BODY PARSING & REQUEST MIDDLEWARE
// ============================================================================

// Parse JSON request body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use(morgan(process.env.LOG_FORMAT === 'json' ? 'combined' : 'dev'));
app.use(requestLogger);

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
    redis: 'connected',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API v1 routes
app.use('/api', apiRoutes);

// ============================================================================
// STATIC FILES
// ============================================================================

// Serve documentation
app.use('/docs', express.static(path.join(__dirname, '../docs')));

// ============================================================================
// 404 HANDLER
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`
    }
  });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();

    if (process.env.DB_AUTO_SYNC !== 'false') {
      await db.sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
    }

    server = app.listen(PORT, () => {
      console.log(`
CodeSpawn Backend Server Started
Environment: ${process.env.NODE_ENV}
Port: ${PORT}
API URL: ${process.env.API_URL || `http://localhost:${PORT}`}
Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}
Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}
  `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  if (!server) {
    process.exit(0);
  }

  server.close(async () => {
    console.log('HTTP server closed');
    
    // Close database connections
    // TODO: Implement when database is connected
    
    // Close Redis connections
    // TODO: Implement when Redis is connected
    
    process.exit(0);
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;

