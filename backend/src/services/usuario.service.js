const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const getAllUsuarios = async () => {
  return await Usuario.findAll({
    where: { activo: true },
    attributes: { exclude: ['password'] }
  });
};

const getUsuarioById = async (id) => {
  return await Usuario.findOne({
    where: { id, activo: true },
    attributes: { exclude: ['password'] }
  });
};

const findByEmail = async (email) => {
  return await Usuario.findOne({ where: { email, activo: true } });
};

const createUsuario = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await Usuario.create({
    ...data,
    password: hashedPassword
  });
};

const updateUsuario = async (id, data) => {
  const usuario = await Usuario.findOne({ where: { id, activo: true } });
  if (!usuario) return null;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await usuario.update(data);
};

const deleteUsuario = async (id) => {
  const usuario = await Usuario.findOne({ where: { id, activo: true } });
  if (!usuario) return false;

  await usuario.update({ activo: false });
  return true;
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  findByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario
};