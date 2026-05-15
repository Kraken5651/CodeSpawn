try { require('dotenv').config(); } catch (e) { /* ignore */ }

module.exports = {
  development: {
    username: process.env.DB_USER || 'codespawn',
    password: process.env.DB_PASSWORD || 'dev_password',
    database: process.env.DB_NAME || 'codespawn_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'codespawn',
    password: process.env.DB_PASSWORD || 'dev_password',
    database: process.env.DB_NAME_TEST || 'codespawn_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false
  }
};
