const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const materialController = require('../controllers/material.controller');

const router = express.Router();

const categoriasValidas = [
  'perfil_estructural',
  'lamina',
  'consumible',
  'acabado',
  'accesorio',
  'otro'
];

const unidadesValidas = [
  'unidad',
  'metro',
  'pie',
  'pulgada',
  'libra',
  'kilogramo',
  'galon',
  'litro',
  'paquete'
];

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
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  materialController.getMaterialById
);

// Solo admin: crear
router.post(
  '/',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    body('nombre')
      .notEmpty()
      .withMessage('Nombre es obligatorio'),

    body('categoria')
      .isIn(categoriasValidas)
      .withMessage('Categoría inválida'),

    body('tipo')
      .notEmpty()
      .withMessage('Tipo es obligatorio'),

    body('precio_unitario')
      .isDecimal()
      .withMessage('Precio unitario inválido'),

    body('stock')
      .optional()
      .isDecimal()
      .withMessage('Stock inválido'),

    body('unidad_medida')
      .isIn(unidadesValidas)
      .withMessage('Unidad de medida inválida'),

    body('largo')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Largo inválido'),

    body('ancho')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Ancho inválido'),

    body('alto')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Alto inválido'),

    body('grosor')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Grosor inválido'),

    body('diametro')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Diámetro inválido'),

    body('descripcion')
      .optional({ nullable: true })
      .isString()
      .withMessage('Descripción inválida')
  ]),
  materialController.createMaterial
);

// Solo admin: actualizar
router.put(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id')
      .isInt()
      .withMessage('ID debe ser entero'),

    body('nombre')
      .optional()
      .notEmpty()
      .withMessage('Nombre inválido'),

    body('categoria')
      .optional()
      .isIn(categoriasValidas)
      .withMessage('Categoría inválida'),

    body('tipo')
      .optional()
      .notEmpty()
      .withMessage('Tipo inválido'),

    body('precio_unitario')
      .optional()
      .isDecimal()
      .withMessage('Precio unitario inválido'),

    body('stock')
      .optional()
      .isDecimal()
      .withMessage('Stock inválido'),

    body('unidad_medida')
      .optional()
      .isIn(unidadesValidas)
      .withMessage('Unidad de medida inválida'),

    body('largo')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Largo inválido'),

    body('ancho')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Ancho inválido'),

    body('alto')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Alto inválido'),

    body('grosor')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Grosor inválido'),

    body('diametro')
      .optional({ nullable: true })
      .isDecimal()
      .withMessage('Diámetro inválido'),

    body('descripcion')
      .optional({ nullable: true })
      .isString()
      .withMessage('Descripción inválida')
  ]),
  materialController.updateMaterial
);

// Solo admin: desactivar
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    param('id').isInt().withMessage('ID debe ser entero')
  ]),
  materialController.deleteMaterial
);

module.exports = router;