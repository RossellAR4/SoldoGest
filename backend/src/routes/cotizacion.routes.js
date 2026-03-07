const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('./middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('./middleware/auth.middleware');
const cotizacionController = require('./controllers/cotizacion.controller');

const router = express.Router();

// Admin y empleado: listar
router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  cotizacionController.getAllCotizaciones
);

// Admin y empleado: obtener por id
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  cotizacionController.getCotizacionById
);

// Admin y empleado: crear cotización
router.post(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    body('clienteId').isInt().withMessage('clienteId debe ser entero'),
    body('descripcion').notEmpty().withMessage('Descripción obligatoria'),
    body('mano_obra').isDecimal().withMessage('mano_obra inválida'),
    body('tiempo_estimado')
      .isInt({ min: 1 })
      .withMessage('tiempo_estimado debe ser entero mayor a 0'),
    body('materiales')
      .isArray({ min: 1 })
      .withMessage('materiales debe ser un arreglo'),
    body('materiales.*.materialId')
      .isInt()
      .withMessage('materialId debe ser entero'),
    body('materiales.*.cantidad')
      .isDecimal()
      .withMessage('cantidad inválida')
  ]),
  cotizacionController.createCotizacion
);

// Solo admin: actualizar estado
router.patch(
  '/:id/estado',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero'),
    body('estado')
      .isIn(['pendiente', 'aprobado', 'cancelado'])
      .withMessage('Estado inválido')
  ]),
  cotizacionController.updateEstado
);

// Solo admin: desactivar (soft delete)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  cotizacionController.deleteCotizacion
);

module.exports = router;