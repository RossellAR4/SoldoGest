const express = require('express');
const { body, param, query } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const cotizacionController = require('../controllers/cotizacion.controller');

const router = express.Router();

router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    query('estado')
      .optional()
      .isIn(['pendiente', 'aprobado', 'cancelado', 'vencido'])
      .withMessage('Estado inválido')
  ]),
  cotizacionController.getAllCotizaciones
);

router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  cotizacionController.getCotizacionById
);

router.post(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    body('clienteId')
      .optional({ nullable: true })
      .isInt()
      .withMessage('clienteId debe ser entero'),

    body('cliente_nombre')
      .optional({ nullable: true })
      .isString()
      .withMessage('Nombre de cliente inválido'),

    body('cliente_telefono')
      .optional({ nullable: true })
      .isString()
      .withMessage('Teléfono inválido'),

    body('cliente_email')
      .optional({ nullable: true })
      .isEmail()
      .withMessage('Email inválido'),

    body('tipo_trabajo')
      .optional({ nullable: true })
      .isString()
      .withMessage('Tipo de trabajo inválido'),

    body('descripcion')
      .notEmpty()
      .withMessage('Descripción obligatoria'),

    body('mano_obra')
      .isDecimal()
      .withMessage('mano_obra inválida'),

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

router.patch(
  '/:id/estado',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero'),
    body('estado')
      .isIn(['pendiente', 'aprobado', 'cancelado', 'vencido'])
      .withMessage('Estado inválido')
  ]),
  cotizacionController.updateEstado
);

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