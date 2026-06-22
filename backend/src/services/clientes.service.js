const { pool } = require('../config/database');

exports.findAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM clientes ORDER BY id'
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM clientes WHERE id = $1',
    [id]
  );
  return rows[0];
};

exports.create = async ({ nombre_empresa, telefono, direccion, correo_contacto, usuario_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO clientes (nombre_empresa, telefono, direccion, correo_contacto, usuario_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [nombre_empresa, telefono, direccion, correo_contacto, usuario_id || null]
  );
  return rows[0];
};

exports.update = async (id, { nombre_empresa, telefono, direccion, correo_contacto }) => {
  const { rows } = await pool.query(
    `UPDATE clientes
     SET nombre_empresa = COALESCE($1, nombre_empresa),
         telefono = COALESCE($2, telefono),
         direccion = COALESCE($3, direccion),
         correo_contacto = COALESCE($4, correo_contacto),
         updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [nombre_empresa, telefono, direccion, correo_contacto, id]
  );
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM clientes WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};
