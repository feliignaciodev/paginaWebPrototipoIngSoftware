const { Router } = require('express');
const authRouter = require('./authRoutes');
const clientesRouter = require('./clientes.routes');
const piscinasRouter = require('./piscinas.routes');
const visitasRouter = require('./visitas.routes');
const inventarioRouter = require('./inventario.routes');
const resumenRouter = require('./resumen.routes');

const router = Router();

router.use('/auth', authRouter);
router.use('/clientes', clientesRouter);
router.use('/piscinas', piscinasRouter);
router.use('/visitas', visitasRouter);
router.use('/inventario', inventarioRouter);
router.use('/resumen', resumenRouter);

module.exports = router;
