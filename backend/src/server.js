require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/database');
const routes = require('./routes');

const app = express();

// --- Middlewares globales ---
app.use(cors());
app.use(express.json());

// --- Rutas ---
app.use('/api', routes);

app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', timestamp: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// --- Manejo de errores global ---
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

module.exports = app;
