const { pool } = require('../config/database');

exports.findAll = async () => {
  const { rows } = await pool.query(
    `SELECT v.*,
            u.nombre AS tecnico_nombre,
            p.ubicacion_detallada AS piscina_ubicacion,
            c.nombre_empresa AS cliente_nombre
     FROM visitas_tecnicas v
     JOIN usuarios u ON u.id = v.tecnico_id
     JOIN piscinas p ON p.id = v.piscina_id
     JOIN clientes c ON c.id = p.cliente_id
     ORDER BY v.fecha_programada DESC`
  );
  return rows;
};

exports.findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT v.*,
            u.nombre AS tecnico_nombre,
            p.ubicacion_detallada AS piscina_ubicacion,
            c.nombre_empresa AS cliente_nombre
     FROM visitas_tecnicas v
     JOIN usuarios u ON u.id = v.tecnico_id
     JOIN piscinas p ON p.id = v.piscina_id
     JOIN clientes c ON c.id = p.cliente_id
     WHERE v.id = $1`,
    [id]
  );
  return rows[0];
};

exports.create = async ({ piscina_id, tecnico_id, fecha_programada, notas }) => {
  const { rows } = await pool.query(
    `INSERT INTO visitas_tecnicas (piscina_id, tecnico_id, fecha_programada, notas)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [piscina_id, tecnico_id, fecha_programada, notas || null]
  );
  return rows[0];
};

exports.update = async (id, { estado, fecha_completada, notas }) => {
  const { rows } = await pool.query(
    `UPDATE visitas_tecnicas
     SET estado = COALESCE($1, estado),
         fecha_completada = COALESCE($2, fecha_completada),
         notas = COALESCE($3, notas),
         updated_at = NOW()
     WHERE id = $4 RETURNING *`,
    [estado, fecha_completada, notas, id]
  );
  return rows[0];
};

exports.remove = async (id) => {
  const { rowCount } = await pool.query(
    'DELETE FROM visitas_tecnicas WHERE id = $1',
    [id]
  );
  return rowCount > 0;
};
