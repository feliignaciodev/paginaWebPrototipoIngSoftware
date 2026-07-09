const { Router } = require('express');
const { verifyToken, requireRoles } = require('../middleware/auth');
const rutasController = require('../controllers/rutas.controller');

const router = Router();

router.get(
  '/',
  verifyToken,
  requireRoles('administrador', 'supervisor'),
  rutasController.getRutas
);

module.exports = router;
