const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const trabajoController = require('../controllers/trabajo.controller');

const router = express.Router();

// Admin y empleado: listar
router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  trabajoController.getAllTrabajos
);

// Admin y empleado: obtener por id
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  trabajoController.getTrabajoById
);

// Admin: crear trabajo desde cotización aprobada
router.post(
  '/desde-cotizacion',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    body('cotizacionId')
      .isInt()
      .withMessage('cotizacionId debe ser entero'),

    body('fecha_estimada_instalacion')
      .notEmpty()
      .withMessage('fecha_estimada_instalacion es obligatoria')
      .isISO8601()
      .withMessage('fecha_estimada_instalacion debe ser una fecha válida')
  ]),
  trabajoController.createFromCotizacion
);

// Admin y empleado: crear trabajo manual
router.post(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    body('clienteId')
      .isInt()
      .withMessage('clienteId debe ser entero'),

    body('descripcion')
      .notEmpty()
      .withMessage('Descripción obligatoria'),

    body('fecha_estimada_instalacion')
      .notEmpty()
      .withMessage('Fecha estimada obligatoria')
      .isISO8601()
      .withMessage('Fecha estimada inválida'),

    body('total')
      .isDecimal()
      .withMessage('Total inválido')
  ]),
  trabajoController.createManual
);

// Admin y empleado: actualizar estado
router.patch(
  '/:id/estado',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero'),
    body('estado')
      .isIn(['en_proceso', 'finalizado', 'cancelado'])
      .withMessage('Estado inválido')
  ]),
  trabajoController.updateEstado
);

// Solo admin: desactivar
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  trabajoController.deleteTrabajo
);

module.exports = router;