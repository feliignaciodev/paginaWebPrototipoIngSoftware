const service = require('../services/insumosUtilizados.service');

exports.getByVisita = async (req, res) => {
  try {
    const rows = await service.findByVisita(req.params.visitaId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const row = await service.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    const status = err.message === 'Stock insuficiente' ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ message: 'Insumo utilizado eliminado y stock restaurado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
