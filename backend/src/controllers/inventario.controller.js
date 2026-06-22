const service = require('../services/inventario.service');

exports.getAll = async (_req, res) => {
  try {
    const rows = await service.findAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const row = await service.findById(req.params.id);
    if (!row) return res.status(404).json({ error: 'Insumo no encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const row = await service.create(req.body);
    res.status(201).json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const row = await service.update(req.params.id, req.body);
    if (!row) return res.status(404).json({ error: 'Insumo no encontrado' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Insumo no encontrado' });
    res.json({ message: 'Insumo eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
