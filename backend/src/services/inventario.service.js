const { pool } = require('../config/database');

exports.findAll = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM inventario_insumos ORDER BY nombre_quimico'
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT * FROM inventario_insumos WHERE id = $1',
    [id]
  );
  return rows[0];
};

exports.create = async ({ nombre_quimico, stock_actual, unidad_medida, stock_minimo }) => {
  const { rows } = await pool.query(
    `INSERT INTO inventario_insumos (nombre_quimico, stock_actual, unidad_medida, stock_minimo)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [nombre_quimico, stock_actual, unidad_medida, stock_minimo || 0]
  );
  return rows[0];
};

exports.update = async (id, { nombre_quimico, stock_actual, unidad_medida, stock_minimo }) => {
  const { rows } = await pool.query(
    `UPDATE inventario_insumos
     SET nombre_quimico = COALESCE($1, nombre_quimico),
         stock_actual = COALESCE($2, stock_actual),
         unidad_medida = COALESCE($3, unidad_medida),
         stock_minimo = COALESCE($4, stock_minimo),
         updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [nombre_quimico, stock_actual, unidad_medida, stock_minimo, id]
  );
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM inventario_insumos WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};
