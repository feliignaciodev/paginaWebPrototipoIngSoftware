const { pool } = require('../config/database');

exports.getByPiscina = async (piscinaId) => {
  const { rows: [piscina] } = await pool.query(
    `SELECT p.*, c.nombre_empresa AS cliente_nombre, c.telefono AS cliente_telefono
     FROM piscinas p
     JOIN clientes c ON c.id = p.cliente_id
     WHERE p.id = $1`,
    [piscinaId]
  );
  if (!piscina) return null;

  const { rows: visitas } = await pool.query(
    `SELECT v.id, v.fecha_programada, v.fecha_completada, v.estado, v.notas,
            u.nombre AS tecnico_nombre
     FROM visitas_tecnicas v
     JOIN usuarios u ON u.id = v.tecnico_id
     WHERE v.piscina_id = $1
     ORDER BY v.fecha_programada DESC`,
    [piscinaId]
  );

  const { rows: insumos } = await pool.query(
    `SELECT iu.visita_id, iu.cantidad_usada, iu.precio_unitario_momento,
            inv.nombre_quimico, inv.unidad_medida,
            (iu.cantidad_usada * iu.precio_unitario_momento) AS subtotal
     FROM insumos_utilizados iu
     JOIN inventario_insumos inv ON inv.id = iu.insumo_id
     JOIN visitas_tecnicas v ON v.id = iu.visita_id
     WHERE v.piscina_id = $1
     ORDER BY v.fecha_programada DESC, inv.nombre_quimico`,
    [piscinaId]
  );

  const insumosMap = {};
  for (const row of insumos) {
    if (!insumosMap[row.visita_id]) insumosMap[row.visita_id] = [];
    insumosMap[row.visita_id].push(row);
  }

  const visitasConInsumos = visitas.map((v) => ({
    ...v,
    insumos: insumosMap[v.id] || [],
    costo_visita: (insumosMap[v.id] || []).reduce(
      (sum, i) => sum + parseFloat(i.subtotal),
      0
    ),
  }));

  const costoTotal = visitasConInsumos.reduce(
    (sum, v) => sum + v.costo_visita,
    0
  );

  return {
    piscina,
    visitas: visitasConInsumos,
    totales: {
      visitas_realizadas: visitas.filter((v) => v.estado === 'completada').length,
      visitas_pendientes: visitas.filter((v) => v.estado !== 'completada').length,
      costo_total: costoTotal,
    },
  };
};
