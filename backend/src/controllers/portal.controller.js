const portalService = require('../services/portal.service');

exports.getMiPortal = async (req, res) => {
  try {
    const data = await portalService.getMiPortal(req.user.id);
    if (!data) return res.status(404).json({ error: 'No se encontró cliente vinculado a este usuario' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearSolicitud = async (req, res) => {
  try {
    const { tipo, descripcion, piscina_id } = req.body;
    if (!tipo || !descripcion || !piscina_id) {
      return res.status(400).json({ error: 'tipo, descripcion y piscina_id son requeridos' });
    }
    if (!['anomalia', 'mantencion_extraordinaria'].includes(tipo)) {
      return res.status(400).json({ error: 'tipo debe ser "anomalia" o "mantencion_extraordinaria"' });
    }
    const visita = await portalService.crearSolicitud(req.user.id, tipo, descripcion, piscina_id);
    res.status(201).json(visita);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
