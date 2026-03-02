const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const clienteController = require('../controllers/cliente.controller');

const router = express.Router();

// Admin y empleado: listar
router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  clienteController.getAllClientes
);

// Admin y empleado: obtener por id
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  clienteController.getClienteById
);

// Admin y empleado: crear
router.post(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    body('telefono').notEmpty().withMessage('Teléfono es obligatorio'),
    body('direccion').optional().notEmpty(),
    body('email').optional().isEmail().withMessage('Email inválido'),
  ]),
  clienteController.createCliente
);

// Admin y empleado: actualizar
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero'),
    body('nombre').optional().notEmpty(),
    body('telefono').optional().notEmpty(),
    body('direccion').optional().notEmpty(),
    body('email').optional().isEmail().withMessage('Email inválido'),
  ]),
  clienteController.updateCliente
);

// Solo admin: desactivar (soft delete)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  clienteController.deleteCliente
);

module.exports = router;