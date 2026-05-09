/**
 * Database Models Index
 * Exports all Sequelize models
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

require('dotenv').config();

// Initialize Sequelize connection
const sequelize = new Sequelize(process.env.DB_URL || process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX) || 10,
    min: parseInt(process.env.DB_POOL_MIN) || 2,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+00:00'
});

const db = {};

// Load all models
const modelsPath = __dirname;
fs
  .readdirSync(modelsPath)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(modelsPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
