const express = require('express');
const { body, param } = require('express-validator');

const validateRequest = require('../middleware/validate.middleware');
const { verifyToken, authorizeRole } = require('../middleware/auth.middleware');
const usuarioController = require('../controllers/usuario.controller');

const router = express.Router();

// Público: login
router.post(
  '/login',
  validateRequest([
    body('email').isEmail().withMessage('Email válido requerido'),
    body('password').notEmpty().withMessage('Password es obligatorio'),
  ]),
  usuarioController.login
);

// Admin: crear usuario
router.post(
  '/',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([
    body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
    body('email').isEmail().withMessage('Email válido requerido'),
    body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
    body('rol').isIn(['admin', 'empleado']).withMessage('Rol inválido'),
  ]),
  usuarioController.createUsuario
);

// Admin: listar usuarios
router.get(
  '/',
  verifyToken,
  authorizeRole('admin'),
  usuarioController.getAllUsuarios
);

// Admin: obtener usuario por id
router.get(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  usuarioController.getUsuarioById
);

// Admin: desactivar usuario (soft delete)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  validateRequest([param('id').isInt().withMessage('ID debe ser entero')]),
  usuarioController.deleteUsuario
);

module.exports = router;