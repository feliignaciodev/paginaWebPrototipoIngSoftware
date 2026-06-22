const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'pool_admin',
  password: process.env.DB_PASSWORD || 'pool_secret_2024',
  database: process.env.DB_NAME || 'pool_management',
});

pool.on('connect', () => {
  console.log('[DB] Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[DB] Error inesperado en el pool:', err);
  process.exit(1);
});

module.exports = { pool };
