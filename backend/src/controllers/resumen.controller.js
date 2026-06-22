const service = require('../services/resumen.service');

exports.getByPiscina = async (req, res) => {
  try {
    const resumen = await service.getByPiscina(req.params.id);
    if (!resumen) return res.status(404).json({ error: 'Piscina no encontrada' });
    res.json(resumen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
