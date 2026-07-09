const rutasService = require('../services/rutas.service');

exports.getRutas = async (req, res) => {
  try {
    const rutas = await rutasService.getRutasPendientes();
    res.json(rutas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
