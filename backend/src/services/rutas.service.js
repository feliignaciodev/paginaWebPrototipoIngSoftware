const { pool } = require('../config/database');

exports.getRutasPendientes = async () => {
  const { rows } = await pool.query(`
    SELECT
      vt.id              AS visita_id,
      vt.piscina_id,
      vt.tecnico_id,
      vt.fecha_programada,
      vt.estado,
      vt.notas,
      u.nombre           AS tecnico_nombre,
      u.correo           AS tecnico_correo,
      c.nombre_empresa   AS cliente_nombre,
      p.ubicacion_detallada,
      p.tipo_agua,
      p.capacidad_litros
    FROM visitas_tecnicas vt
    JOIN usuarios  u ON u.id = vt.tecnico_id
    JOIN piscinas  p ON p.id = vt.piscina_id
    JOIN clientes  c ON c.id = p.cliente_id
    WHERE vt.estado IN ('pendiente', 'en_progreso')
    ORDER BY vt.tecnico_id, vt.estado DESC, vt.fecha_programada ASC
  `);

  const tecnicosMap = new Map();
  for (const row of rows) {
    if (!tecnicosMap.has(row.tecnico_id)) {
      tecnicosMap.set(row.tecnico_id, {
        tecnico_id:     row.tecnico_id,
        tecnico_nombre: row.tecnico_nombre,
        tecnico_correo: row.tecnico_correo,
        visitas:        [],
      });
    }
    const orden = tecnicosMap.get(row.tecnico_id).visitas.length + 1;
    tecnicosMap.get(row.tecnico_id).visitas.push({
      visita_id:          row.visita_id,
      orden,
      piscina_id:         row.piscina_id,
      cliente_nombre:     row.cliente_nombre,
      ubicacion_detallada: row.ubicacion_detallada,
      tipo_agua:          row.tipo_agua,
      capacidad_litros:   row.capacidad_litros,
      fecha_programada:   row.fecha_programada,
      estado:             row.estado,
      notas:              row.notas,
    });
  }

  return Array.from(tecnicosMap.values());
};
