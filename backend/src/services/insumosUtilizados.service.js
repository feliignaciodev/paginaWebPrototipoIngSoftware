const { pool } = require('../config/database');

exports.findByVisita = async (visitaId) => {
  const { rows } = await pool.query(
    `SELECT iu.*, inv.nombre_quimico, inv.unidad_medida,
            (iu.cantidad_usada * iu.precio_unitario_momento) AS subtotal
     FROM insumos_utilizados iu
     JOIN inventario_insumos inv ON inv.id = iu.insumo_id
     WHERE iu.visita_id = $1
     ORDER BY inv.nombre_quimico`,
    [visitaId]
  );
  return rows;
};

exports.create = async ({ visita_id, insumo_id, cantidad_usada }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: [insumo] } = await client.query(
      'SELECT precio_unitario, stock_actual FROM inventario_insumos WHERE id = $1',
      [insumo_id]
    );
    if (!insumo) throw new Error('Insumo no encontrado');

    if (parseFloat(insumo.stock_actual) < cantidad_usada) {
      throw new Error('Stock insuficiente');
    }

    const { rows: [registro] } = await client.query(
      `INSERT INTO insumos_utilizados (visita_id, insumo_id, cantidad_usada, precio_unitario_momento)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [visita_id, insumo_id, cantidad_usada, insumo.precio_unitario]
    );

    await client.query(
      `UPDATE inventario_insumos
       SET stock_actual = stock_actual - $1, updated_at = NOW()
       WHERE id = $2`,
      [cantidad_usada, insumo_id]
    );

    await client.query('COMMIT');
    return registro;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.remove = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: [registro] } = await client.query(
      'DELETE FROM insumos_utilizados WHERE id = $1 RETURNING *',
      [id]
    );
    if (!registro) {
      await client.query('ROLLBACK');
      return false;
    }

    await client.query(
      `UPDATE inventario_insumos
       SET stock_actual = stock_actual + $1, updated_at = NOW()
       WHERE id = $2`,
      [registro.cantidad_usada, registro.insumo_id]
    );

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
