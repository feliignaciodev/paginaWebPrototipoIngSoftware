const { Router } = require('express');
const { verifyToken, requireRoles } = require('../middleware/auth');
const portalController = require('../controllers/portal.controller');

const router = Router();

router.get('/',           verifyToken, requireRoles('cliente'), portalController.getMiPortal);
router.post('/solicitud', verifyToken, requireRoles('cliente'), portalController.crearSolicitud);

module.exports = router;
