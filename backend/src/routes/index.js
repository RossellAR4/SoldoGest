const express = require('express');
const router = express.Router();

router.use('/usuarios', require('./usuario.routes'));
router.use('/clientes', require('./cliente.routes'));
router.use('/materiales', require('./material.routes'));
router.use('/cotizaciones', require('./cotizacion.routes'));
router.use('/trabajos', require('./trabajo.routes'));

router.get('/', (req, res) => {
  res.json({ message: 'API SoldoGest v1 funcionando 🚀' });
});

module.exports = router;