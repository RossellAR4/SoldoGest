const usuarioService = require('../services/usuario.service');
const jwt = require('jsonwebtoken');

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.getUsuarioById(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await usuarioService.deleteUsuario(id);
    if (!success) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================== LOGIN ==================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuarioService.findByEmail(email);

    if (!usuario) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const bcrypt = require('bcrypt');
    const validPassword = await bcrypt.compare(password, usuario.password);

    if (!validPassword) return res.status(401).json({ message: 'Credenciales incorrectas' });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const data = {
      nombre: req.body.nombre,
      email: req.body.email,
      rol: req.body.rol
    };

    const usuario = await usuarioService.updateUsuario(id, data);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({
      error: 'Error actualizando usuario',
      detalle: error.message
    });
  }
};

module.exports = {
  updateUsuario,
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  deleteUsuario,
  login
};