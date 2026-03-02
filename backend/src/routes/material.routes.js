const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const materialController = require('../controllers/material.controller');

const router = express.Router();

// Admin y empleado: listar
router.get(
  '/',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  materialController.getAllMateriales
);

// Admin y empleado: obtener por id
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin', 'empleado'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  materialController.getMaterialById
);

// Solo admin: crear
router.post(
  '/',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    body('tipo')
      .isIn(['varilla', 'tubo_cuadrado', 'tubo_redondo', 'lamina', 'otro'])
      .withMessage('Tipo inválido'),
    body('precio_unitario').isDecimal().withMessage('Precio unitario inválido'),
    body('stock').optional().isDecimal().withMessage('Stock inválido'),
    body('longitud').isDecimal().withMessage('Longitud inválida'),
    body('ancho').optional().isDecimal().withMessage('Ancho inválido'),
    body('alto').optional().isDecimal().withMessage('Alto inválido'),
    body('grosor').isDecimal().withMessage('Grosor inválido'),
    body('unidad_medida').notEmpty().withMessage('Unidad de medida obligatoria'),
  ]),
  materialController.createMaterial
);

// Solo admin: actualizar
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero'),
    body('nombre').optional().notEmpty(),
    body('tipo')
      .optional()
      .isIn(['varilla', 'tubo_cuadrado', 'tubo_redondo', 'lamina', 'otro'])
      .withMessage('Tipo inválido'),
    body('precio_unitario').optional().isDecimal(),
    body('stock').optional().isDecimal(),
    body('longitud').optional().isDecimal(),
    body('ancho').optional().isDecimal(),
    body('alto').optional().isDecimal(),
    body('grosor').optional().isDecimal(),
    body('unidad_medida').optional().notEmpty(),
  ]),
  materialController.updateMaterial
);

// Solo admin: desactivar (soft delete)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  materialController.deleteMaterial
);

module.exports = router;