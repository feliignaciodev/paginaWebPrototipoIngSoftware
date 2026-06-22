const { pool } = require('../config/database');

exports.findAll = async () => {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre_empresa AS cliente_nombre
     FROM piscinas p
     JOIN clientes c ON c.id = p.cliente_id
     ORDER BY p.id`
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT p.*, c.nombre_empresa AS cliente_nombre
     FROM piscinas p
     JOIN clientes c ON c.id = p.cliente_id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0];
};

exports.create = async ({ cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada }) => {
  const { rows } = await pool.query(
    `INSERT INTO piscinas (cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada]
  );
  return rows[0];
};

exports.update = async (id, { cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada }) => {
  const { rows } = await pool.query(
    `UPDATE piscinas
     SET cliente_id = COALESCE($1, cliente_id),
         capacidad_litros = COALESCE($2, capacidad_litros),
         tipo_agua = COALESCE($3, tipo_agua),
         ubicacion_detallada = COALESCE($4, ubicacion_detallada),
         updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [cliente_id, capacidad_litros, tipo_agua, ubicacion_detallada, id]
  );
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM piscinas WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};
