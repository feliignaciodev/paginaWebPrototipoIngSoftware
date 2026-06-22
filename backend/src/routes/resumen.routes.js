const { Router } = require('express');
const resumenController = require('../controllers/resumen.controller');
const insumosController = require('../controllers/insumosUtilizados.controller');

const router = Router();

router.get('/piscinas/:id', resumenController.getByPiscina);

router.get('/visitas/:visitaId/insumos', insumosController.getByVisita);
router.post('/insumos-utilizados', insumosController.create);
router.delete('/insumos-utilizados/:id', insumosController.remove);

module.exports = router;
