const { pool } = require('../config/database');

const PLAN_MENSUAL = 55000;

const PLANES = [
  { id: 'basico',    nombre: 'Básico',    precio: 55000,  visitas: 1, descripcion: 'Una visita mensual' },
  { id: 'estandar', nombre: 'Estándar',  precio: 90000,  visitas: 2, descripcion: 'Dos visitas mensuales' },
  { id: 'premium',  nombre: 'Premium',   precio: 130000, visitas: 4, descripcion: 'Cuatro visitas mensuales' },
];

exports.getMiPortal = async (userId) => {
  // Cliente vinculado al usuario
  const { rows: clienteRows } = await pool.query(
    'SELECT * FROM clientes WHERE usuario_id = $1',
    [userId]
  );
  if (!clienteRows[0]) return null;
  const cliente = clienteRows[0];

  // Piscinas del cliente
  const { rows: piscinas } = await pool.query(
    `SELECT p.*,
            (SELECT COUNT(*) FROM visitas_tecnicas WHERE piscina_id = p.id AND estado = 'completada') AS visitas_realizadas,
            (SELECT COUNT(*) FROM visitas_tecnicas WHERE piscina_id = p.id AND estado IN ('pendiente','en_progreso')) AS visitas_pendientes,
            (SELECT fecha_programada FROM visitas_tecnicas WHERE piscina_id = p.id AND estado IN ('pendiente','en_progreso') ORDER BY fecha_programada ASC LIMIT 1) AS proxima_visita
     FROM piscinas p
     WHERE p.cliente_id = $1
     ORDER BY p.id`,
    [cliente.id]
  );

  return {
    cliente,
    piscinas,
    planes: PLANES,
    plan_actual: PLANES[0],
    costo_mensual: piscinas.filter((p) => p.activa).length * PLAN_MENSUAL,
  };
};

exports.crearSolicitud = async (userId, tipo, descripcion, piscinaId) => {
  // Verificar que la piscina pertenece al cliente
  const { rows: clienteRows } = await pool.query(
    'SELECT id FROM clientes WHERE usuario_id = $1',
    [userId]
  );
  if (!clienteRows[0]) throw new Error('Cliente no encontrado');
  const clienteId = clienteRows[0].id;

  const { rows: piscinaRows } = await pool.query(
    'SELECT id FROM piscinas WHERE id = $1 AND cliente_id = $2',
    [piscinaId, clienteId]
  );
  if (!piscinaRows[0]) throw new Error('Piscina no pertenece al cliente');

  // Guardar como visita extraordinaria con notas descriptivas
  const prefix = tipo === 'anomalia' ? '[ANOMALÍA]' : '[MANTENCIÓN EXTRAORDINARIA]';
  const { rows } = await pool.query(
    `INSERT INTO visitas_tecnicas (piscina_id, tecnico_id, fecha_programada, estado, notas)
     VALUES ($1, 1, NOW() + INTERVAL '3 days', 'pendiente', $2)
     RETURNING id, fecha_programada, estado, notas`,
    [piscinaId, `${prefix} ${descripcion}`]
  );
  return rows[0];
};
