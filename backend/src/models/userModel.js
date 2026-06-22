const { pool } = require('../config/database');

exports.findByEmail = async (correo) => {
  const { rows } = await pool.query(
    'SELECT * FROM usuarios WHERE correo = $1',
    [correo]
  );
  return rows[0];
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, nombre, correo, rol, activo, created_at FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0];
};

exports.create = async ({ nombre, correo, password_hash, rol }) => {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, correo, rol, activo, created_at`,
    [nombre, correo, password_hash, rol || 'cliente']
  );
  return rows[0];
};
